
from channels.generic.websocket import WebsocketConsumer

from account.models import User
from chat.models import Conversation
from chat.serializers import ConversationSerializer
from asgiref.sync import async_to_sync
import json

class ChatConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.group_name = None

    def connect(self):
        self.user1_id = self.scope["url_route"]["kwargs"]["user1"]
        self.user2_id = self.scope["url_route"]["kwargs"]["user2"]

        self.user1 = User.objects.filter(id=self.user1_id).first()
        self.user2 = User.objects.filter(id=self.user2_id).first()

        if not self.user1 or not self.user2:
            print("You are not permitted")
            return
        
        # Group name must be a valid unicode string containing only ASCII alphanumerics, hyphens, or periods.
        self.group_name = f"chat_{min(self.user2_id,self.user1_id)}_{max(self.user1_id,self.user2_id)}"

        # connection has to be accepted
        self.accept()

        # join the room group
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name,
        )

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name,
        )

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        user1 = User.objects.get(id=text_data_json['user1'])
        user2 = User.objects.get(id=text_data_json['user2'])
        obj= Conversation.objects.create(user1=user1,user2=user2,message=text_data_json['message'])
        serialized_data = ConversationSerializer(obj).data


        # send chat message event to the group
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": "chat_message",
                "message": serialized_data,
            },
        )

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))