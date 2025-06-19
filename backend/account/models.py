from django.contrib.auth.models import User
from django.db import models
from utils.models import TimeStampedModel
from main.models import Country
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(TimeStampedModel):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('prefer_not_to_say', 'Prefer Not to Say')
    )
    user = models.OneToOneField(User, blank=False, null=False, on_delete=models.CASCADE)
    phone_number = models.CharField(blank=True, null=True, max_length=13)
    country = models.ForeignKey(Country, blank=True, null=True, on_delete=models.SET_NULL)
    avatar = models.ImageField(upload_to='account/avatars', blank=True, null=True)

    gender = models.CharField(blank=True, null=True, choices=GENDER_CHOICES, max_length=30)


@receiver(post_save, sender=User)
def institution_post_save(sender, instance, created, **kwargs):
    if created:
        # Create a user profile if None
        if getattr(instance, 'profile', None) is None:
            Profile.objects.create(user=instance)
