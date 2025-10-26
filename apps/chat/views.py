from rest_framework import generics, permissions, status
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_class = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(Q(guest=user) | Q(landlord=user)).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(guest=self.request.user, landlord=reservation.property.user)

class MessageListCreateView(generics.ListCreateView):
    serializer_class = MessageSerializer
    permission_class = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs['id']
        return Message.objects.filter(conversation_id=conversation_id).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(sender=request.user, conversation_id=self.kwargs['id'])
