from rest_framework import serializers

from .models import Property, Reservation

from apps.profiles.serializers import ProfileSerializer

class PropertyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'price_per_night',
            'image_url',
            'favorited',
            'views',
        ]

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None

class PropertyDetailSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(source="user.profile")

    class Meta:
        model = Property
        fields = [
            'id',
            'user',
            'title',
            'description',
            'price_per_night',
            'bedrooms',
            'beds',
            'bathrooms',
            'guests',
            'location',
            'category',
            'favorited',
            'image_url',
            'views',
        ]

class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'title',
            'description',
            'price_per_night',
            'bedrooms',
            'beds',
            'bathrooms',
            'guests',
            'location',
            'category',
            'favorited',
            'image',
        ]
    # Use field 'image' for creating instance of property
        
class ReservationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    property = serializers.StringRelatedField(read_only=True)
    property_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id',
            'user',
            'property',
            'property_id',
            'start_date',
            'end_date',
            'number_of_nights',
            'guests',
            'total_price',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'number_of_nights', 'total_price']

    def create(self, validated_data):
        user = self.context['request'].user
        property_id = validated_data.pop('property_id')

        # Import inside to avoid circular imports if needed
        from properties.models import Property
        property_instance = Property.objects.get(id=property_id)

        start_date = validated_data.get('start_date')
        end_date = validated_data.get('end_date')

        # Auto-calculate nights and price
        nights = (end_date - start_date).days
        validated_data['number_of_nights'] = nights
        validated_data['total_price'] = nights * property_instance.price_per_night

        reservation = Reservation.objects.create(
            user=user,
            property=property_instance,
            **validated_data
        )
        return reservation