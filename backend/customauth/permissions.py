from rest_framework_api_key.permissions import BaseHasAPIKey
from .models import CustomAPIKey


class HasCustomAPIKey(BaseHasAPIKey):
    model = CustomAPIKey

    def has_permission(self, request, view):
        # Extract the domain from the Origin header
        request_host = request.get_host()
        network = request_host.split('.')[0]
        request_origin = request.headers.get('Origin')
        api_key = request.headers.get('API-KEY')

        if api_key is None:
            return False

        try:
            custom_api_key = CustomAPIKey.objects.get_from_key(api_key)
        except CustomAPIKey.DoesNotExist:
            return False

        # Check if the domain matches the expected origin
        if custom_api_key.domain == request_origin:
            return True
        else:
            return False