from rest_framework import serializers, viewsets, permissions

from accesos.models import Surtidor


class SurtidorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Surtidor
        fields = ['id', 'nombre', 'latitud', 'longitud']

class SurtidorViewSet(viewsets.ModelViewSet):
    queryset = Surtidor.objects.all()
    serializer_class = SurtidorSerializer
    permission_classes = [permissions.IsAuthenticated]