from django.urls import path

from .cloudinary_example import upload_image

urlpatterns = [
    path('upload-image/', upload_image, name='upload_image'),
]
