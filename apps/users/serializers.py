from rest_framework import serializers

from .models import User

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'id',
            'username',
            'email',
            'phone_number',
            'display_picture',
            'date_joined'
        ]