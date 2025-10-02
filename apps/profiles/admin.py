from django.contrib import admin

# Register your models here.
from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "gender", "phone_number", "country", "city"]
    list_display_links = ["id",  "user"]

admin.site.register(Profile, ProfileAdmin)