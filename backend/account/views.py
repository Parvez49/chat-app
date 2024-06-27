from django.shortcuts import render
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from .models import User
from .serializers import UserRegistrationSerializer, LoginSerializer, UserListSerializer

from icecream import ic
import os



class PasswordResetConfirmView(generics.CreateAPIView):
    def post(self,request):
        uidb64= request.data.get('uid')
        token=request.data.get('token')
        password=request.data.get('password')
        confirm_password=request.data.get('confirm_password')
        if password!=confirm_password:
            raise ValidationError({"Error": "Passwords do not match."})
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise ValidationError({"Error": "Invalid user ID."})
        
        if not PasswordResetTokenGenerator().check_token(user, token):
            raise ValidationError({"Error": "Invalid or expired token."})
        
        # Set new password
        user.set_password(password)
        user.save()
        
        return Response({"message": "Password has been reset successfully."})
    
        
class PublicRequestPasswordReset(generics.CreateAPIView):

    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if not user:
            raise Response({'message': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Generate password reset token
        token_generator = PasswordResetTokenGenerator()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        # Build reset password link
        current_site = get_current_site(request)
        schema=os.environ.get("FRONTEND_SCHEMA")
        domain=os.environ.get("FRONTEND_DOMAIN")
        reset_url = reverse('password_reset_confirm')
        reset_url = f"{schema}://{domain}/{uid}/{token}"

        # Send email with reset link
        subject = 'Password Reset'
        message = f'Hi {user.first_name},\n\nPlease click the following link to reset your password:\n {reset_url}'
        #send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])

        return Response({'message': 'Password reset link has been sent to your email.',"msg":message})

class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')

        user = User.objects.filter(email=email).first()
        user_serializer = UserRegistrationSerializer(user)

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)

            return Response({
                'token':{
                    'access': str(refresh.access_token),
                'refresh': str(refresh),
                },
                'user_data':user_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserRegistrationSerializer

    def get_object(self):
        id=self.kwargs.get('id')
        user=User.objects.filter(id=id).first()
        return user

class UserRegistrationView(generics.CreateAPIView):
    # queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access_token=refresh.access_token
        user_serializer=UserRegistrationSerializer(user)

        return Response({'token': {
            'refresh': str(refresh),
            'access': str(access_token),
            'user':user_serializer.data
        }}, status=status.HTTP_201_CREATED)

class UserListAPIView(generics.ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    search_fields = [
        "name",
    ]

    def get_queryset(self):
        queryset = User.objects.all()
        return queryset

