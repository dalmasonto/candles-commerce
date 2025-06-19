from django.contrib.auth.hashers import make_password
from drf_writable_nested import WritableNestedModelSerializer, UniqueFieldsMixin, NestedUpdateMixin
from rest_framework import serializers
from rest_framework.authtoken.admin import User

from main.extraserializers import CountrySerializer
from .models import Profile
from main.utils import BaseSerializer


class ProfileSerializer(UniqueFieldsMixin, serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['id', 'user', 'phone_number', 'avatar', 'country', 'gender']
        extra_kwargs = {
            'user': {
                "required": False
            }
        }

    def to_representation(self, instance):
        fields = self.get_fields()
        required_fields = set(fields.keys())
        if 'country' in required_fields:
            self.fields['country'] = CountrySerializer(many=False)

        return super(ProfileSerializer, self).to_representation(instance)


class AccountSerializer(BaseSerializer, UniqueFieldsMixin, WritableNestedModelSerializer):
    profile = ProfileSerializer(required=False)
    full_name = serializers.SerializerMethodField(required=False)

    def validate_username(self, username):
        if self.instance is None and User.objects.filter(username=username).exists():
            raise serializers.ValidationError("User with this username already exists. Choose a different username",
                                              code='unique')
        return username

    def validate_email(self, email):
        if self.instance is None and User.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this email already exists. Reset your password instead",
                                              code='unique')
        return email

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'full_name', 'password', 'last_name', 'email', 'is_superuser',
                  'is_staff', 'is_active', 'date_joined', 'profile', 'last_login']
        extra_kwargs = {
            "password": {
                "write_only": True,
                "required": False
            },
            # "is_superuser": {
            #     "read_only": True
            # },
            # "is_staff": {
            #     "read_only": True
            # },
            "is_active": {
                "read_only": True
            },
            "date_joined": {
                "read_only": True
            },
            "last_login": {
                "read_only": True
            },
            "username": {
                "required": False
            }
        }

    def create(self, validated_data, *args, **kwargs):
        validated_data['password'] = make_password(validated_data.get('password', validated_data.get('username')))
        return super().create(validated_data)

    def get_full_name(self, obj):
        return obj.get_full_name()

    # def update(self, instance, validated_data):
    #     for key in list(validated_data.keys()):
    #         if key not in self.initial_data:
    #             validated_data.pop(key)
    #     return super().update(instance, validated_data)

    def to_representation(self, instance):
        fields = self.get_fields()
        required_fields = set(fields.keys())
        if 'profile' in required_fields:
            self.fields['profile'] = ProfileSerializer(many=False)

        return super(AccountSerializer, self).to_representation(instance)

