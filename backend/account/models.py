from django.db import models
from django.utils import timezone
"""
Database models.
"""
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
)
from core.models import BaseModelWithUID
from rest_framework_simplejwt.tokens import RefreshToken
from .managers import UserManager


from autoslug import AutoSlugField

GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
class User(AbstractBaseUser, PermissionsMixin, BaseModelWithUID):
    name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(max_length=255, unique=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    # def __str__(self):
    #     return self.email or self.phone

    # def get_full_name(self):
    #     return f"{self.first_name} {self.last_name}"
    
    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }
    
    # def save(self, *args, **kwargs):
    #     if not self.slug:
    #         self.slug = self.generate_unique_slug()
    #     super().save(*args, **kwargs)

    # def generate_unique_slug(self):
    #     base_slug = slugify(self.get_full_name())
    #     timestamp = timezone.now().strftime("%Y%m%d%H%M%S")
    #     return f"{base_slug}-{timestamp}"
