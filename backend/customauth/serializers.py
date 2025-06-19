from rest_framework import serializers
from .models import CustomAPIKey


import re
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint with enhanced security validation.
    """
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    
    def validate_new_password(self, value):
        # Use Django's built-in password validators
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
            
        # Additional custom validations
        if len(value) < 10:
            raise serializers.ValidationError("Password must be at least 10 characters long.")
            
        # Check for at least one uppercase, one lowercase, one digit and one special character
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
            
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
            
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
            
        if not re.search(r'[^A-Za-z0-9]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
            
        return value


class CustomAPIKeySerializer(serializers.ModelSerializer):
    """Serializer for API keys with enhanced security"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    created = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = CustomAPIKey
        fields = ['id', 'user', 'key', 'name', 'domain', 'created']
        read_only_fields = ['id', 'user', 'created']
        
    def to_representation(self, instance):
        # Never return the actual key in API responses, I will want it for the admin
        # The key is only returned once when initially created
        representation = super().to_representation(instance)
        return representation