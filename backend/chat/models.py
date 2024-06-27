from django.db import models
from django.core.exceptions import ValidationError

from account.models import User
from core.models import BaseModelWithUID

class Friends(BaseModelWithUID): 
    user1 = models.ForeignKey(User,related_name='user1_friends',on_delete=models.CASCADE)
    user2 = models.ForeignKey(User,related_name='user2_friends',on_delete=models.CASCADE)
    block = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user1', 'user2')
    
    def save(self, *args, **kwargs):
        if self.user1 == self.user2:
            raise ValidationError("User1 and User2 cannot be the same.")
        super(Friends, self).save(*args, **kwargs)

    @classmethod
    def get_friends_for_user(cls, user):
        # Retrieve all friends of the given user
        user1_friends = cls.objects.filter(user1=user)
        user2_friends = cls.objects.filter(user2=user)
        friends = (user1_friends | user2_friends).distinct()
        return friends

        # user_friends = Friends.get_friends_for_user(some_user)

# user1_friends = some_user.user1_friends.all()
# user2_friends = some_user.user2_friends.all()


class Conversation(BaseModelWithUID):
    user1 = models.ForeignKey(User,related_name='user1_convers',on_delete=models.CASCADE)
    user2 = models.ForeignKey(User,related_name='user2_convers',on_delete=models.CASCADE)
    message = models.CharField(max_length=500)

