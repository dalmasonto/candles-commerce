from rest_framework import serializers
from rest_framework.response import Response

from .models import Media
from rest_framework.pagination import PageNumberPagination
import random
import string
from dataclasses import dataclass


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'limit'
    page_query_param = 'page'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })


def generate_uuid(length=6):
    """
    Generate a random UUID consisting of 5 uppercase letters and numbers.
    """
    characters = string.ascii_uppercase + string.digits
    uuid = ''.join(random.choice(characters) for _ in range(length))
    return uuid


def classify_file_by_extension(file_name):
    image_extensions = ['jpg', 'jpeg', 'png', 'gif']
    video_extensions = ['mp4', 'avi', 'mkv', 'mov']
    document_extensions = ['pdf', 'doc', 'docx', 'txt']
    audio_extensions = ['mp3', 'wav', 'ogg']

    file_extension = file_name.split('.')[-1].lower()

    if file_extension in image_extensions:
        return 'image'
    elif file_extension in video_extensions:
        return 'video'
    elif file_extension in document_extensions:
        return 'document'
    elif file_extension in audio_extensions:
        return 'audio'
    else:
        return 'unknown'


def create_file(file):
    if file is not None and hasattr(file, 'name'):
        title = f'{file.name}'
        file_type = classify_file_by_extension(file.name)
        file = Media.objects.create(
            title=title[0:60],
            file=file,
            type=file_type
        )
        file.save()
        return file
    return None


def create_files(files):
    media_list = [Media(file=file, title=f'{file.name}'[0:60], type=classify_file_by_extension(file.name))
                  for file in files]
    media_created = Media.objects.bulk_create(media_list)
    return media_created


def clogger(line_number, label, value):
    """
    :param line_number: Line number where you are logging at
    :param label: Label of the log
    :param value: What to log
    :return: Prints out the line number, label and value
    """
    print(f"\n{line_number}: {label} - {value}\n")


class BaseSerializer(serializers.Serializer):
    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request', None)
        if request:
            request_fields = self.context['request'].query_params.get('fields', None)
            fields_ = request_fields.split(',') if request_fields else []
            fields_ = [f.strip() for f in fields_]
            if fields_:
                allowed = set([f.strip() for f in fields_])
                existing = set(fields.keys())
                for field_name in existing - allowed:
                    fields.pop(field_name)
        return fields


@dataclass
class UserStats:
    total: int
    male: int
    female: int


@dataclass
class ContactFormEntriesStats:
    total: int
    read: int
    unread: int


@dataclass
class Stats:
    users: UserStats
    reviews: int
    countries: int
    subscribers: int
    blog_categories: int
    blogs: int
    contact_form_entries: ContactFormEntriesStats


