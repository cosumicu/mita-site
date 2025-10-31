from rest_framework import serializers
from .models import Conversation, Message
from apps.profiles.serializers import ProfileSerializer
from apps.properties.serializers import ReservationSerializer

class ConversationSerializer(serializers.ModelSerializer):
    guest = ProfileSerializer(source='guest.profile', read_only=True)
    landlord = ProfileSerializer(source='landlord.profile', read_only=True)
    reservation = ReservationSerializer(read_only=True)
    
    class Meta:
        model = Conversation
        fields = [
            'id',
            'guest',
            'landlord',
            'reservation',
            'created_at',
        ]

class MessageSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(source='sender.profile', read_only=True)
    conversation_id = serializers.CharField(source='conversation.id')

    class Meta:
        model = Message
        fields = [
            'id',
            'conversation_id',
            'sender',
            'text',
            'created_at',
        ]