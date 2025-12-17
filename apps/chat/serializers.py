from rest_framework import serializers
from .models import Conversation, Message
from apps.profiles.serializers import ProfileSerializer
from apps.properties.serializers import ReservationSerializer

class ConversationSerializer(serializers.ModelSerializer):
    guest = ProfileSerializer(source='guest.profile', read_only=True)
    landlord = ProfileSerializer(source='landlord.profile', read_only=True)
    reservation = ReservationSerializer(read_only=True)
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id',
            'guest',
            'landlord',
            'reservation',
            'last_message',
            'created_at',
        ]

    def get_last_message(self, obj):
        # obj.messages.all() is already prefetched
        last_msg = max(obj.messages.all(), key=lambda m: m.created_at, default=None)
        if last_msg:
            return MessageSerializer(last_msg).data
        return None

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