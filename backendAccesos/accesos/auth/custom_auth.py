from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from accesos.api.user_viewset import UserSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['user_id'] = user.id
        token['username'] = user.username
        token['email'] = user.email

        userDb = User.objects.filter(id=user.id).first()
        serializer = UserSerializer(userDb)

        if userDb and len(serializer.data['groups']) > 0:
            token['role'] = serializer.data['groups'][0]

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
