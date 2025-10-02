from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from autoslug import AutoSlugField
from django_countries.fields import CountryField

from apps.common.models import TimeStampedUUIDModel

User = get_user_model()

class Property(TimeStampedUUIDModel):
    user = models.ForeignKey(User, related_name='properties', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    slug = AutoSlugField(populate_from="title", unique=True, always_update=True)
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    guests = models.IntegerField()
    country = CountryField(default="PH",)
    country_code = models.CharField(max_length=10)
    city = models.CharField(max_length=255, default="Manila")
    category = models.CharField(max_length=255)
    favorited = models.ManyToManyField(User, related_name='favorites', blank=True)
    image = models.ImageField(upload_to='uploads/properties')
    views = models.IntegerField(default=0)


    def image_url(self):
        return f'{settings.WEBSITE_URL}{self.image.url}'
    
    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"

class Reservation(TimeStampedUUIDModel):
    user = models.ForeignKey(User, related_name='reservations', on_delete=models.CASCADE)
    property = models.ForeignKey(Property, related_name='reservations', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    number_of_nights = models.IntegerField()
    guests = models.IntegerField()
    total_price = models.FloatField()

class PropertyView(TimeStampedUUIDModel):
    property = models.ForeignKey(Property, related_name="property_views", on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField()