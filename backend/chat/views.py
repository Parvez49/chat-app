from django.shortcuts import render, get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from .models import Friends, Conversation
from .serializers import FriendsSerializer, ConversationSerializer


class ConversationListAPIView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user1 = self.request.user
        user2 = self.kwargs.get('id')
        queryset = Conversation.objects.select_related('user1').filter(Q(user1=user1,user2=user2) | Q(user1=user2,user2=user1)).order_by('created_at')
        return queryset
    

class ConversationListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user1'] = self.request.user
        return context
    
    def get_queryset(self):
        user = self.request.user
        queryset = Conversation.objects.filter(Q(user1=user.id) | Q(user2=user.id)).order_by("id")
        return queryset


class ConversationRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user1'] = self.request.user
        return context
    
    def get_object(self):
        id = self.kwargs.get('id')
        queryset = Conversation.objects.filter(id=id)
        obj = get_object_or_404(queryset)
        return obj
    

class FriendsListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = FriendsSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    search_fields = [
        "user2__name",
    ]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user1'] = self.request.user
        return context
    
    def get_queryset(self):
        user= self.request.user
        queryset = Friends.objects.select_related('user2','user1').filter(Q(user1=user.id) | Q(user2=user.id))
        return queryset


class FriendsRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Friends.objects.all()
    serializer_class = FriendsSerializer

    def get_serializer_context(self):
        context= super().get_serializer_context()
        context['user1'] = self.request.user
        return context
    
    def get_object(self):
        id = self.kwargs.get('id')
        queryset = Friends.objects.filter(id=id)
        obj = get_object_or_404(queryset)
        return obj

