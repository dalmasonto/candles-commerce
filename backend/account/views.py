from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.response import Response

from main.utils import StandardResultsSetPagination
from main.permissions import IsAuthenticatedOrPostOnly, AdminFieldsPermission
from main.authentication import AUTH_CLASS

from rest_framework.filters import SearchFilter, OrderingFilter

from .serializers import AccountSerializer, ProfileSerializer
from .models import Profile


class AccountViewSet(viewsets.ModelViewSet):
    queryset = User.objects.prefetch_related('profile').all().order_by('id')
    serializer_class = AccountSerializer

    authentication_classes = [AUTH_CLASS]
    permission_classes = [IsAuthenticatedOrPostOnly, AdminFieldsPermission]

    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    ordering_fields = ['id', 'first_name', 'last_name', 'email', 'username']
    filterset_fields = ['is_superuser', 'is_staff']
    search_fields = ['email', 'first_name', 'last_name', 'username', 'profile__phone_number']
    
    def update(self, request, *args, **kwargs):
        # Get the instance being updated
        instance = self.get_object()
        
        # Check if admin fields are being modified
        admin_fields = {'is_staff', 'is_superuser'}
        request_fields = set(request.data.keys())
        
        # If admin fields are being modified and user is not a superuser
        if admin_fields.intersection(request_fields) and not request.user.is_superuser:
            return Response(
                {"detail": "Only superusers can modify admin privileges."}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Otherwise proceed with the update
        return super().update(request, *args, **kwargs)
        
    def partial_update(self, request, *args, **kwargs):
        # Get the instance being updated
        instance = self.get_object()
        
        # Check if admin fields are being modified
        admin_fields = {'is_staff', 'is_superuser'}
        request_fields = set(request.data.keys())
        
        # If admin fields are being modified and user is not a superuser
        if admin_fields.intersection(request_fields) and not request.user.is_superuser:
            return Response(
                {"detail": "Only superusers can modify admin privileges."}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Otherwise proceed with the update
        return super().partial_update(request, *args, **kwargs)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all().order_by('id')
    serializer_class = ProfileSerializer

    authentication_classes = [AUTH_CLASS]
    permission_classes = [IsAuthenticatedOrPostOnly]

    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = []
    search_fields = []

