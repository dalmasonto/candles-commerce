from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAuthenticatedOrPostOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS or request.method == 'PUT' or request.method == 'PATCH':
            return request.user and request.user.is_authenticated
        return True


class AdminFieldsPermission(BasePermission):
    """
    Custom permission to only allow superusers to modify admin fields (is_staff, is_superuser).
    """
    def has_permission(self, request, view):
        # Allow all requests to pass this check, actual filtering happens in has_object_permission
        return True
    
    def has_object_permission(self, request, view, obj):
        # For safe methods (GET, HEAD, OPTIONS) or non-admin field updates, allow access
        if request.method in SAFE_METHODS:
            return True
            
        # For PUT/PATCH methods, check if admin fields are being modified
        if request.method in ['PUT', 'PATCH']:
            # Check if admin fields are in the request data
            admin_fields = set(['is_staff', 'is_superuser'])
            request_fields = set(request.data.keys())
            
            # If any admin field is being modified
            if admin_fields.intersection(request_fields):
                # Only superusers can modify admin fields
                return request.user.is_superuser
                
        # For other methods or if no admin fields are being modified
        return True
