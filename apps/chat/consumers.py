import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message
from .serializers import MessageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        print("Joining group:", self.room_group_name)  # DEBUG

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        conversation_id = data.get("conversation_id")
        sender_id = data.get("sender_id")
        text = data.get("text")
        print(text)

        if not text or not sender_id:
            return

        # Save message first
        message = await self.create_message(conversation_id, sender_id, text)

        # Broadcast full message
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",  # method name
                "id": str(message.id),  # convert UUID to string
                "conversation_id": str(message.conversation.id),  # UUID → str
                "sender": {
                    "id": str(message.sender.id),  # if UUID, convert
                    "username": message.sender.username,
                },
                "text": message.text,
                "created_at": message.created_at.isoformat(),
            },
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def create_message(self, conversation_id, sender_id, text):
        conversation = Conversation.objects.get(id=conversation_id)
        sender = User.objects.get(id=sender_id)
        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            text=text,
        )
        return message
