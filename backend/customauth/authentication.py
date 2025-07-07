from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import AnonymousUser
from .models import CustomAPIKey


class APIKeyAuthentication(BaseAuthentication):
    """
    Custom authentication class for API key authentication.
    This works alongside the HasCustomAPIKey permission class.
    """
    
    def authenticate(self, request):
        # Get API key from header
        api_key = request.headers.get('API-KEY')
        
        if not api_key:
            return None  # No API key provided, let other authentication classes handle it
        
        try:
            # Validate the API key
            custom_api_key = CustomAPIKey.objects.get_from_key(api_key)
            
            # If the API key is associated with a user, return that user
            if custom_api_key.user:
                return (custom_api_key.user, api_key)
            else:
                # If no user is associated, return an anonymous user
                # This allows the permission class to still validate the API key
                return (AnonymousUser(), api_key)
                
        except CustomAPIKey.DoesNotExist:
            return None  # Invalid API key, let other authentication classes handle it
        except Exception as e:
            # Log the error but don't expose details to the client
            print(f"API Key authentication error: {str(e)}")
            return None
