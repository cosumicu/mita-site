from django_countries.serializer_fields import CountryField
from rest_framework import fields, serializers
from phonenumber_field.serializerfields import PhoneNumberField

from .models import Profile, Gender


class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    full_name = serializers.SerializerMethodField(read_only=True)
    profile_picture_url = serializers.SerializerMethodField(read_only=True)

    country = CountryField(name_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "user_id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone_number",
            "profile_picture_url",
            "about_me",
            "gender",
            "country",
            "city",
            "rating",
            "num_reviews",
            "host_status",
            "host_since",
            "valid_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user_id",
            "username",
            "email",
            "full_name",
            "profile_picture_url",
            "rating",
            "num_reviews",
            "host_status",
            "host_since",
            "created_at",
            "updated_at",
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_profile_picture_url(self, obj):
        # uses your model method if you want:
        try:
            return obj.profile_picture_url()
        except Exception:
            return None


class ProfileUpdateSerializer(serializers.ModelSerializer):
    phone_number = PhoneNumberField(required=False)

    class Meta:
        model = Profile
        fields = [
            "first_name",
            "last_name",
            "profile_picture",
            "about_me",
            "phone_number",
            "gender",
            "country",
            "city",
            "valid_id",
        ]

    def validate_gender(self, value):
        if value not in dict(Gender.choices):
            raise serializers.ValidationError("Invalid gender.")
        return value