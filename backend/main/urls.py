from django.urls import path, include
from rest_framework import routers

from .views import (home, MediaViewSet, ContactViewSet, CategoryViewSet, BlogTagViewSet,
                    BlogViewSet, BlogReplyViewSet, ReviewViewSet, RandomBlogViewSet, CountryViewSet, SubscriberViewSet,
                    AppStatsView, UserStatsView, FAQViewSet)

router = routers.DefaultRouter()
router.register(r'media', MediaViewSet)
router.register(r'contact', ContactViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'blogs/blog-tags', BlogTagViewSet)
router.register(r'blogs/blog-replies', BlogReplyViewSet)
router.register(r'blogs/random-blogs', RandomBlogViewSet)
router.register(r'blogs', BlogViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'countries', CountryViewSet)
router.register(r'subscribers', SubscriberViewSet)
router.register(r'faqs', FAQViewSet)

urlpatterns = [
    path('', home, name='home'),
    path('app-stats/', AppStatsView.as_view(), name='app-stats'),
    path('user-stats/', UserStatsView.as_view(), name='app-stats'),
    path('', include(router.urls))
]
