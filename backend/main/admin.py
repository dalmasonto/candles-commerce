from django.contrib import admin

from .models import *
# Register your models here.

admin.site.register([Contact, Category, BlogTag, Blog, BlogReply, Review, Media, Country])
