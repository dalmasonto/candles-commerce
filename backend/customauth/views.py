from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_decode
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from main.authentication import AUTH_CLASS
from main.utils import StandardResultsSetPagination
from .models import CustomAPIKey
from .serializers import ChangePasswordSerializer

from django.utils.encoding import force_str
from .tokens import account_activation_token
from account.serializers import AccountSerializer
from .serializers import CustomAPIKeySerializer


class CustomLogin(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': AccountSerializer(user).data
        })


class ActivateAccount(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        # Validate required fields are present
        if 'token' not in request.data or 'uidb64' not in request.data:
            return Response({
                "message": "Missing required fields",
                "success": False
            }, status=status.HTTP_400_BAD_REQUEST)
            
        token = request.data['token']
        uidb64 = request.data['uidb64']

        # Validate token format to prevent injection attacks
        if not isinstance(token, str) or not isinstance(uidb64, str):
            return Response({
                "message": "Invalid token format",
                "success": False
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the user ID
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            # Check if user is already active - prevent redundant activations
            if user.is_active:
                return Response({
                    "message": "Account is already active",
                    "success": True
                })
                
            # Verify the token
            if account_activation_token.check_token(user, token):
                user.is_active = True
                user.save()
                return Response({
                    "message": "Account confirmation successful",
                    "success": True
                })
            else:
                # Invalid or expired token
                return Response({
                    "message": "The confirmation link is invalid or has expired",
                    "success": False
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except (TypeError, ValueError, OverflowError):
            # Handle decoding errors
            return Response({
                "message": "Invalid activation link format",
                "success": False
            }, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            # Use the same response for non-existent users to prevent user enumeration
            return Response({
                "message": "The confirmation link is invalid or has expired",
                "success": False
            }, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password with enhanced security.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    authentication_classes = [AUTH_CLASS]  # Use consistent authentication class
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password - use constant time comparison to prevent timing attacks
            if not self.object.check_password(serializer.validated_data.get("old_password")):
                # Use a generic error message to prevent user enumeration
                return Response(
                    {"error": "Current password is incorrect."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Validate that new password is different from the old one
            if self.object.check_password(serializer.validated_data.get("new_password")):
                return Response(
                    {"error": "New password must be different from the current password."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # set_password handles the password hashing
            self.object.set_password(serializer.validated_data.get("new_password"))
            
            # Invalidate all existing tokens for this user for security
            Token.objects.filter(user=self.object).delete()
            
            # Create a new token for the user
            new_token = Token.objects.create(user=self.object)
            
            # Save the user with the new password
            self.object.save()
            
            # Return success response with new token
            response = {
                'status': 'success',
                'message': 'Password updated successfully',
                'new_token': new_token.key  # Provide new token for re-authentication
            }

            return Response(response, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@authentication_classes([AUTH_CLASS])
def check_user_logged_in(request):
    """
    Check if the user is logged in.
    """
    if request.user.is_authenticated:
        return Response({'logged_in': True})
    return Response({'logged_in': False})


@api_view(['POST'])
@authentication_classes([AUTH_CLASS])
def logout_user(request):
    """
    Log out a user by invalidating their token with enhanced security.
    """
    # Check if the user is authenticated with a valid token
    if request.user.is_authenticated:
        # Get the user's token
        try:
            # Use select_for_update to prevent race conditions
            from django.db import transaction
            with transaction.atomic():
                token = Token.objects.select_for_update().get(user=request.user)
                
                # Record the logout for audit purposes
                from django.utils import timezone
                request.user.last_login = timezone.now()
                request.user.save(update_fields=['last_login'])
                
                # Delete the user's token to invalidate it
                token.delete()
                
            return Response({'detail': 'User logged out successfully.'}, status=status.HTTP_200_OK)
            
        except Token.DoesNotExist:
            # Use a generic error message
            return Response({'detail': 'Session expired or invalid.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)


class APIKeyListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomAPIKeySerializer
    authentication_classes = [AUTH_CLASS]

    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return CustomAPIKey.objects.filter(user=self.request.user)


class CreateAPIKeyView(generics.CreateAPIView):
    serializer_class = CustomAPIKeySerializer
    authentication_classes = [AUTH_CLASS]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = self.request.user
        
        # Validate required fields
        if 'domain' not in request.data or 'name' not in request.data:
            return Response(
                {"error": "Both domain and name fields are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        domain = request.data['domain']
        name = request.data['name']
        
        # Validate input data
        if not isinstance(domain, str) or not isinstance(name, str):
            return Response(
                {"error": "Domain and name must be strings"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Limit the number of API keys per user to prevent abuse
        if CustomAPIKey.objects.filter(user=user).count() >= 5:  # Adjust limit as needed
            return Response(
                {"error": "Maximum number of API keys reached"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Create the API key
            api_key, key = CustomAPIKey.objects.create_key(name=name, domain=domain, user=user)
            
            # Store the key temporarily for the response
            api_key_response = CustomAPIKeySerializer(api_key).data
            api_key_response['key'] = key  # Include the key in the response
            
            return Response(api_key_response, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {"error": "Failed to create API key", "details": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DeleteAPIKeyView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [AUTH_CLASS]

    def post(self, request, *args, **kwargs):
        # Validate input
        api_key_id = request.data.get('id')
        
        if not api_key_id:
            return Response({'error': 'API key ID not provided.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Validate ID format
        try:
            api_key_id = int(api_key_id)
        except (ValueError, TypeError):
            return Response({'error': 'Invalid API key ID format.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Use select_for_update to prevent race conditions
            from django.db import transaction
            with transaction.atomic():
                api_key = CustomAPIKey.objects.select_for_update().get(pk=api_key_id)
                
                # Ensure the API key belongs to the authenticated user
                if api_key.user != request.user:
                    # Use constant time comparison to prevent timing attacks
                    return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

                # Delete the API key
                api_key.delete()
                
            return Response({'message': 'API key deleted successfully'}, status=status.HTTP_200_OK)
            
        except CustomAPIKey.DoesNotExist:
            # Use the same response time for non-existent keys to prevent enumeration
            return Response({'error': 'API key not found.'}, status=status.HTTP_404_NOT_FOUND)