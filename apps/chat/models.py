from django.db import models

from django.contrib.auth import get_user_model
from apps.common.models import TimeStampedUUIDModel
from apps.properties.models import Reservation

User = get_user_model()

class Conversation(TimeStampedUUIDModel):
    reservation = models.ForeignKey(Reservation, related_name='conversations', on_delete=models.CASCADE)
    guest = models.ForeignKey(User, related_name='guest_conversations', on_delete=models.DO_NOTHING)
    landlord = models.ForeignKey(User, related_name='landlord_conversations', on_delete=models.DO_NOTHING)

    @property
    def last_message(self):
        return self.messages.order_by('-created_at').first()

class Message(TimeStampedUUIDModel):
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    text = models.TextField(max_length=512)