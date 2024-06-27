

from django.urls import path
from . import views

urlpatterns = [
    path('/reset-password', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('/forgot-password',views.PublicRequestPasswordReset.as_view(),name='request-reset-password'),
    path('/login',views.LoginAPIView.as_view(),name='user-login'),
    path("/<int:id>",views.UserProfileView.as_view(),name='user-profile'),
    path('/register', views.UserRegistrationView.as_view(), name='user-register'),
    path('/list',views.UserListAPIView.as_view(),name='user-list'),
]
