from .models import Conversation, Message
from apps.profile.serializers import ProfileSerializer
from apps.properties.serializers import ReservationSerializer

class ConversationSerializer(serializers.ModelSerializer):
    guest = ProfileSerializer(source='user.profile', read_only=True)
    landlord = ProfileSerializer(source='user.profile', read_only=True)
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
    sender = ProfileSerializer(source='user.profile', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id',
            'sender',
            'text',
            'created_at',
        ]