from django.db import models
from django.contrib.auth import get_user_model
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField

from apps.common.models import TimeStampedUUIDModel

User = get_user_model()

class Gender(models.TextChoices):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"

class Profile(TimeStampedUUIDModel):
    user = models.OneToOneField(User, related_name="profile", on_delete = models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    profile_picture = models.ImageField(upload_to="mediafiles/profile_pictures", default="mediafiles/default_profile_picture.jpg")
    about_me = models.TextField(default="...", max_length=255)
    phone_number = PhoneNumberField(max_length=30, default="+639000000000")
    gender = models.CharField(choices=Gender.choices, default=Gender.OTHER, max_length=10)
    country = CountryField(default="PH", blank=False, null=False, max_length=50)
    city = models.CharField(max_length=180, default="Manila", blank=False, null=False)
    rating = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    num_reviews = models.IntegerField(default=0, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"