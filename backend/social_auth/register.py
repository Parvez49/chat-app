
from django.contrib.auth import authenticate
from account.models import User
import os
import random
from account.serializers import UserRegistrationSerializer


def generate_username(name):

    username = "".join(name.split(' ')).lower()
    if not User.objects.filter(username=username).exists():
        return username
    else:
        random_username = username + str(random.randint(0, 1000))
        return generate_username(random_username)


def register_social_user(email, name):
    user = User.objects.filter(email=email)

    if user.exists():
        user_data=UserRegistrationSerializer(user)
        # registered_user = authenticate(
        #     email=email, password=os.environ.get('SOCIAL_SECRET'))

        return {
            "profile_data":user_data.data,
            'tokens': user.tokens()}

    else:
        name = name.split(' ')
        first_name=''
        last_name=''

        if name:
            first_name=name[0]
            last_name=' '.join(name[1:]) if len(name)>1 else '' 
        user = {
            'first_name':first_name,
            'last_name':last_name,
            'email': email,
            'password': os.environ.get('SOCIAL_SECRET')}
        user = User.objects.create_user(**user)
        user.is_verified = True
        user.save()

        user_data=UserRegistrationSerializer(user)

        return {
            "profile_data":user_data.data,
            'tokens': user.tokens()
        }