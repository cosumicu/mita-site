from django_countries.serializer_fields import CountryField
from rest_framework import fields, serializers

from .models import Profile

from apps.ratings.serializers import RatingSerializer


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    email = serializers.EmailField(source="user.email")
    full_name = serializers.SerializerMethodField(read_only=True)
    country = CountryField(name_only=True)
    reviews = serializers.SerializerMethodField(read_only=True)

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
            "profile_picture",
            "about_me",
            "gender",
            "country",
            "city",
            "rating",
            "num_reviews",
            "reviews",
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    
    def get_reviews(self, obj):
        reviews = obj.landlord_review.all()
        serializer = RatingSerializer(reviews, many=True)
        return serializer.data

class ProfileUpdateSerializer(serializers.ModelSerializer):
    country = CountryField(name_only=True)

    class Meta:
        model = Profile
        fields = [
            "first_name",
            "last_name",
            "phone_number",
            "profile_picture",
            "about_me",
            "gender",
            "country",
            "city",
        ]