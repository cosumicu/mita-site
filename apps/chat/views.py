from rest_framework import generics, permissions, status
from django.db.models import Max, Q, F, Value
from django.db.models.functions import Coalesce
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        conversations = Conversation.objects.filter(
            Q(guest=user) | Q(landlord=user)
        ).annotate(
            latest_message_time=Max('messages__created_at'),
            # Use conversation created_at if no messages exist
            sort_time=Coalesce('latest_message_time', 'created_at')
        ).order_by('-sort_time')
        
        return conversations

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs['id']
        return Message.objects.filter(conversation__id=conversation_id).order_by('created_at')

    def perform_create(self, serializer):
        conversation_id = self.kwargs['id']
        conversation = get_object_or_404(Conversation, id=conversation_id)
        text = self.request.data.get('text')

        serializer.save(
            sender=self.request.user,
            conversation=conversation,
            text=text,
        )