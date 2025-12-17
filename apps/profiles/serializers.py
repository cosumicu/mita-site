from django_countries.serializer_fields import CountryField
from rest_framework import fields, serializers

from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="user.id")
    username = serializers.CharField(source="user.username")
    email = serializers.EmailField(source="user.email")
    full_name = serializers.SerializerMethodField(read_only=True)
    country = CountryField(name_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "phone_number",
            "profile_picture_url",
            "about_me",
            "gender",
            "country",
            "city",
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class ProfileUpdateSerializer(serializers.ModelSerializer):
    country = CountryField(name_only=True)

    class Meta:
        model = Profile
        fields = [
            "first_name",
            "last_name",
            "phone_number",
            "profile_picture_url",
            "about_me",
            "gender",
            "country",
            "city",
        ]