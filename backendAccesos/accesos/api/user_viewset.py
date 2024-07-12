from django.contrib.auth.models import User, Group
from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accesos.api.surtidor_viewset import SurtidorSerializer
from accesos.models import Surtidor


class ChoferSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    surtidor_id = serializers.IntegerField(write_only=True, required=False)
    surtidor = serializers.SerializerMethodField()

    def get_groups(self, obj):
        groups = obj.groups[0]
        return groups.id
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email', 'groups', 'surtidor_id', 'surtidor')

    def get_surtidor(self, obj):
        surtidores = obj.surtidores_users.all()
        if surtidores.exists():
            return SurtidorSerializer(surtidores.first()).data
        return None


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        group = request.data.get('groups')
        surtidor_id = request.data.get('surtidor_id')

        if surtidor_id != '':
            surtidor = Surtidor.objects.all().filter(id=surtidor_id).first()
            if surtidor is None:
                return Response({'error': 'Surtidor no existe'}, status=status.HTTP_400_BAD_REQUEST)

        if not group:
            return Response({'error': 'Groups is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not first_name:
            return Response({'error': 'First name is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not last_name:
            return Response({'error': 'Last name is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=request.data.get('username'),
            password=request.data.get('password'),
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        user_group = Group.objects.get(id=group[0])
        user.groups.add(user_group)
        user.save()
        # user = User.objects.get(id=user.id)
        serializer = UserSerializer(user)

        if surtidor_id != '':
            user.surtidores_users.add(surtidor_id)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        surtidor_id = request.data.get('surtidor_id', None)
        # if surtidor_id is not '':
        #     print("no es vacio")
        # else:
        #     print("es vacio")
        if surtidor_id != '':
            surtidor = Surtidor.objects.all().filter(id=surtidor_id).first()
            if surtidor is None:
                return Response({'error': 'Surtidor no existe'}, status=status.HTTP_400_BAD_REQUEST)

        # validar si el username a cambiar ya existe
        username = request.data.get('username')
        if username:
            user = User.objects.all().filter(username=username).exclude(id=instance.id).first()
            if user:
                return Response({'error': 'Username ya existe'}, status=status.HTTP_400_BAD_REQUEST)

        instance.first_name = request.data.get('first_name')
        instance.last_name = request.data.get('last_name')
        instance.email = request.data.get('email')
        instance.groups.clear()
        instance.groups.add(request.data.get('groups')[0])
        instance.save()

        instance.username = username
        instance.save()

        # si hay password en el request, cambiar la contraseña
        password = request.data.get('password')
        if password:
            instance.set_password(password)
            instance.save()

        if surtidor_id != '':
            instance.surtidores_users.clear()
            instance.surtidores_users.add(surtidor_id)
        else:
            instance.surtidores_users.clear()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = self.get_serializer(request.user)
        token = request.auth
        role = token['role']

        origin = request.META.get('HTTP_REFERER')

        # el front de accesos esta en    localhost:5173, aqui solo se puede acceder a los usuarios con role 1
        # el front de ventas esta en     localhost:5174, aqui solo se puede acceder a los usuarios con role 3 y 4
        # el front de refinerias esta en localhost:5175, aqui solo se puede acceder a los usuarios con role 2 y 5
        if ('localhost:5173' in origin or '127.0.0.1:5173' in origin) and role != 1:
            return Response({'error': 'No tiene permisos para acceder a este recurso'}, status=403)
        if ('localhost:5174' in origin or '127.0.0.1:5174' in origin) and role not in [3, 4]:
            return Response({'error': 'No tiene permisos para acceder a este recurso'}, status=403)
        if ('localhost:5175' in origin or '127.0.0.1:5175' in origin) and role not in [2, 5]:
            return Response({'error': 'No tiene permisos para acceder a este recurso xd'}, status=403)
        return Response(serializer.data)



    # endpoint para obtener los choferes
    @action(detail=False, methods=['get'], url_path='choferes')
    def choferes(self, request):
        queryset = User.objects.filter(groups__name='Chofer')
        serializer = ChoferSerializer(queryset, many=True)
        return Response(serializer.data)