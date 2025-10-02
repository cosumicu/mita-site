from rest_framework import serializers

from .models import Property, Reservation

from apps.users.serializers import UserDetailSerializer


class PropertyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'price_per_night',
            'image_url',
            'views',
        ]


class PropertyDetailSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True, many=False)

    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'description',
            'price_per_night',
            'image_url',
            'bedrooms',
            'bathrooms',
            'guests',
            'user'
        ]


class ReservationsListSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True, many=False)
    
    class Meta:
        model = Reservation
        fields = [
            'id',
            'start_date',
            'end_date',
            'number_of_nights',
            'total_price',
            'property',
        ]