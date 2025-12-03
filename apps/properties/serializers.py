from rest_framework import serializers

from .models import Property, Reservation, PropertyLike

from apps.profiles.serializers import ProfileSerializer

class PropertyListSerializer(serializers.ModelSerializer):
    liked = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'category',
            'location',
            'guests',
            'status',
            'image_url',
            'liked',
            'views_count',
            'likes_count',
            'reservations_count',
            'price_per_night',
            'weekly_discount_rate',
            'monthly_discount_rate',
            'cleaning_fee',
            'service_fee_rate',
            'tax_rate',
            'created_at',
            'updated_at',
        ]

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None
    
    def get_liked(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

class PropertyDetailSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(source="user.profile")
    liked = serializers.SerializerMethodField()
    
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
            'image_url',
            'liked',
            'views_count',
            'likes_count',
            'reservations_count',
        ]

    def get_liked(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

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
            'image',
        ]
    # Use field 'image' for creating instance of property
        
class ReservationSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(source="user.profile", read_only=True)
    property = PropertyDetailSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id',
            'user',
            'property',
            'start_date',
            'end_date',
            'guests',
            'number_of_nights',
            'status',
            'long_stay_discount',
            'cleaning_fee',
            'service_fee_rate',
            'tax_rate',
            'total_amount',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'number_of_nights',
            'long_stay_discount',
            'cleaning_fee',
            'service_fee_rate',
            'tax_rate',
            'total_amount',
            'status',
            'created_at',
            'updated_at',
        ]

class PropertyLikeSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = PropertyLike
        fields = ["id", "property", "user", "created", "modified"]

    def get_id(self, obj):
        return str(obj.id)