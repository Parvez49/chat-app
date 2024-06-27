
from rest_framework import serializers
from .models import Friends, Conversation


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ('id', 'user2', 'message')

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user1'] = self.context.get('user1')
        return data
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['user1'] = instance.user1.id
        return data
    
from account.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email','profile_photo'] 

class FriendsSerializer(serializers.ModelSerializer):
    # user2 = UserSerializer(read_only=True)
    class Meta:
        model = Friends
        fields = ['id', 'user2', 'block']
        # depth = 1             # depth get all nested model data fields. better to use Serializer instead

    def to_representation(self, instance):
        user1 = self.context.get('user1')
        data= super().to_representation(instance)
        if (user1.id == instance.user1.id):
            data['user2'] = UserSerializer(instance.user2).data
        else:        
            data['user2'] = UserSerializer(instance.user1).data  # it works well for POST and GET method
        return data

    def validate(self, attrs):
        data = super().validate(attrs)
        user1 = self.context.get('user1')
        data['user1'] = user1
        return data
    
    # def update(self, instance, validated_data):
    #     return super().update(instance, validated_data)
    
    
