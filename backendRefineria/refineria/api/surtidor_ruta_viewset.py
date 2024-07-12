from rest_framework import serializers, viewsets

from refineria.models import SurtidorRuta


class SurtidorRutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurtidorRuta
        fields = ['id', 'surtidor_id', 'litros_entrega', 'completado', 'urgente']


class SurtidorRutaInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurtidorRuta
        fields = ['surtidor_id', 'litros_entrega']


class SurtidorRutaViewSet(viewsets.ModelViewSet):
    queryset = SurtidorRuta.objects.all()
    serializer_class = SurtidorRutaSerializer
    # permission_classes = [permissions.IsAuthenticated]
