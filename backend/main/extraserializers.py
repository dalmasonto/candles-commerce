from rest_framework import serializers
from .models import Media, Country
from .utils import BaseSerializer


class MediaSerializer(serializers.ModelSerializer):
    media_url = serializers.SerializerMethodField()

    class Meta:
        model = Media
        fields = ['id', 'file', 'title', 'type', 'media_url']

        extra_kwargs = {
            'image_url': {
                'required': False
            }
        }

    def get_media_url(self, obj):
        return f""


class CountrySerializer(BaseSerializer, serializers.ModelSerializer):

    class Meta:
        model = Country
        fields = '__all__'
