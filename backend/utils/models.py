from django.db import models

# Create your models here.


class TimeStampedModel(models.Model):
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']
        abstract = True


class Image(TimeStampedModel):
    """Model for storing images with Cloudinary integration"""
    file = models.ImageField(upload_to='images')
    cloudinary_url = models.URLField(blank=True, null=True)
    public_id = models.CharField(max_length=255, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        # If this is a new image being saved and we're using Cloudinary
        from django.conf import settings
        if hasattr(settings, 'DEFAULT_FILE_STORAGE') and 'cloudinary' in settings.DEFAULT_FILE_STORAGE:
            # Only upload to Cloudinary if we have a file and no public_id yet
            if self.file and not self.public_id and not self.cloudinary_url:
                from .cloudinary_utils import upload_file_to_cloudinary
                # Upload the file to Cloudinary
                result = upload_file_to_cloudinary(
                    file=self.file,
                    folder='images',
                    resource_type='image'
                )
                # Store the Cloudinary URL and public_id
                self.cloudinary_url = result.get('secure_url')
                self.public_id = result.get('public_id')
        
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # Delete from Cloudinary if we have a public_id
        if self.public_id:
            from .cloudinary_utils import delete_file_from_cloudinary
            try:
                delete_file_from_cloudinary(self.public_id)
            except Exception as e:
                # Log the error but continue with deletion
                print(f"Error deleting from Cloudinary: {e}")
        
        super().delete(*args, **kwargs)
