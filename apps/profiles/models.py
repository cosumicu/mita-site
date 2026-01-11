from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField

from apps.common.models import TimeStampedUUIDModel

User = get_user_model()

class Gender(models.TextChoices):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"

class HostStatus(models.TextChoices):
    INACTIVE = "INACTIVE", "Inactive"
    ONBOARDING = "ONBOARDING", "Onboarding"
    ACTIVE = "ACTIVE", "Active"
    SUSPENDED = "SUSPENDED", "Suspended"

class Profile(TimeStampedUUIDModel):
    user = models.OneToOneField(User, related_name="profile", on_delete = models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    profile_picture = models.ImageField(upload_to="profile_pictures", default="profile_pictures/default_profile_picture.jpg")
    about_me = models.TextField(default="...", max_length=255)
    phone_number = PhoneNumberField(max_length=30, null=True, blank=True)
    gender = models.CharField(choices=Gender.choices, default=Gender.OTHER, max_length=10)
    country = CountryField(default="PH", blank=False, null=False, max_length=50)
    city = models.CharField(max_length=180, default="Manila", blank=False, null=False)
    rating = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    num_reviews = models.IntegerField(default=0, null=True, blank=True)
    host_status = models.CharField(
        max_length=20,
        choices=HostStatus.choices,
        default=HostStatus.INACTIVE,
    )
    host_since = models.DateTimeField(null=True, blank=True)
    valid_id = models.ImageField(upload_to="ids", null=True, blank=True)

    def profile_picture_url(self):
        return f'{settings.WEBSITE_URL}{self.profile_picture.url}'

    def __str__(self):
        return f"{self.user.username}'s profile"