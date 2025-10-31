from rest_framework import generics, permissions, status
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(Q(guest=user) | Q(landlord=user)).order_by('-created_at')

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs['id']
        return Message.objects.filter(conversation__id=conversation_id)

    def perform_create(self, serializer):
        conversation_id = self.kwargs['id']
        conversation = get_object_or_404(Conversation, id=conversation_id)
        text = self.request.data.get('text')

        serializer.save(
            sender=self.request.user,
            conversation=conversation,
            text=text,
        )