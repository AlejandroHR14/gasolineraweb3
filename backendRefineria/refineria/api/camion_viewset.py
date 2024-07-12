from rest_framework import serializers, viewsets, status
from rest_framework.response import Response

from refineria.models import Camion, TipoCombustible


class CamionSerializer(serializers.ModelSerializer):
    tipo_combustible = serializers.CharField(source='tipo_combustible.nombre', read_only=True)
    tipo_combustible_id = serializers.IntegerField(write_only=True, required=True)
    class Meta:
        model = Camion
        fields = ['id', 'nombre', 'capacidad', 'tipo_combustible', 'tipo_combustible_id', 'user_id']


class CamionViewSet(viewsets.ModelViewSet):
    queryset = Camion.objects.all()
    serializer_class = CamionSerializer
    # permission_classes = [permissions.IsAdministradorSurtidor]


    # def create
    def create(self, request, *args, **kwargs):
        serializer = CamionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        nombre = request.data.get('nombre')
        capacidad = request.data.get('capacidad')
        tipo_combustible_id = request.data.get('tipo_combustible_id')
        user_id = request.data.get('user_id')

        if not nombre:
            return Response({'error': 'Nombre es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if not capacidad:
            return Response({'error': 'Capacidad es requerida'}, status=status.HTTP_400_BAD_REQUEST)
        if not tipo_combustible_id:
            return Response({'error': 'Tipo de combustible es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if not user_id:
            return Response({'error': 'Usuario es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        # validar si el usuario no esta asignado a otro camion
        camion = Camion.objects.all().filter(user_id=user_id).first()
        if camion:
            return Response({'error': 'Usuario ya esta asignado a un camion'}, status=status.HTTP_400_BAD_REQUEST)

        tipo_combustible = TipoCombustible.objects.all().filter(id=tipo_combustible_id).first()
        camion = Camion.objects.create(
            nombre=nombre,
            capacidad=capacidad,
            tipo_combustible=tipo_combustible,
            user_id=user_id
        )
        camion.save()
        return Response(serializer.data)

    # def update
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = CamionSerializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        nombre = request.data.get('nombre')
        capacidad = request.data.get('capacidad')
        tipo_combustible_id = request.data.get('tipo_combustible_id')
        user_id = request.data.get('user_id')

        if not nombre:
            return Response({'error': 'Nombre es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if not capacidad:
            return Response({'error': 'Capacidad es requerida'}, status=status.HTTP_400_BAD_REQUEST)
        if not tipo_combustible_id:
            return Response({'error': 'Tipo de combustible es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if not user_id:
            return Response({'error': 'Usuario es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        tipo_combustible = TipoCombustible.objects.all().filter(id=tipo_combustible_id).first()

        instance.nombre = nombre
        instance.capacidad = capacidad
        instance.tipo_combustible = tipo_combustible
        instance.user_id = user_id
        instance.save()
        return Response(serializer.data)