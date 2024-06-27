from django.urls import path
from . import views

urlpatterns = [
    path('/conversations/user2/<int:id>',views.ConversationListAPIView.as_view(),name='conversation-list'),
    path('/conversations', views.ConversationListCreateAPIView.as_view(), name='conversation-list-create'),
    path('/conversations/<int:id>', views.ConversationRetrieveUpdateDestroyAPIView.as_view(), name='conversation-retrieve-update-destroy'),

    path('/friends', views.FriendsListCreateAPIView.as_view(), name='friends-list-create'),
    path('/friends/<int:id>', views.FriendsRetrieveUpdateDestroyAPIView.as_view(), name='friends-retrieve-update-destroy'),
]
