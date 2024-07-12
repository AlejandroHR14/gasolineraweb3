from rest_framework import serializers, viewsets

from ventas.models import TipoCombustible
from ventas.permissions import permissions


class TipoCombustibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoCombustible
        fields = ['id', 'nombre']


class TipoCombustibleViewSet(viewsets.ModelViewSet):
    queryset = TipoCombustible.objects.all()
    serializer_class = TipoCombustibleSerializer
    permission_classes = [permissions.IsAdministradorSurtidor]