from rest_framework import serializers
from .models import Rating

class RatingSerializer(serializers.ModelSerializer):
    rater = serializers.SerializerMethodField(read_only=True)  
    landlord = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Rating
        exclude = ["pkid", "updated_at"]

    def get_rater(self, obj):
        return obj.rater.username
    
    def get_landlord(self, obj):
        return obj.landlord.user.username