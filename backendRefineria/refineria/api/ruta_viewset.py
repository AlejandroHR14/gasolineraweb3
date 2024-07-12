import requests
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from refineria.api.camion_viewset import CamionSerializer
from refineria.api.surtidor_ruta_viewset import SurtidorRutaInputSerializer, SurtidorRutaSerializer
from refineria.models import Ruta, SurtidorRuta, Camion


class RutaSerializer(serializers.ModelSerializer):
    camion = CamionSerializer(read_only=True)
    camion_id = serializers.IntegerField(write_only=True, required=True)
    surtidores = SurtidorRutaInputSerializer(many=True, read_only=True)

    class Meta:
        model = Ruta
        fields = ['id', 'nombre', 'fecha', 'camion', 'camion_id', 'litros_combustible', 'tipo_combustible', 'precio_por_litro', 'completado', 'surtidores']

class RutaViewSet(viewsets.ModelViewSet):
    queryset = Ruta.objects.all().order_by('fecha')
    serializer_class = RutaSerializer

    def perform_create(self, serializer):
        surtidores_data = self.request.data.get('surtidores', [])
        ruta = serializer.save()
        for surtidor_data in surtidores_data:
            SurtidorRuta.objects.create(ruta=ruta, **surtidor_data)


    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        surtidores = SurtidorRuta.objects.all().filter(ruta=instance)
        serializer = RutaSerializer(instance)
        surtidores_serializer = SurtidorRutaSerializer(surtidores, many=True)
        data = serializer.data
        data['surtidores'] = surtidores_serializer.data
        return Response(data)


    # endpoint rutas por chofer
    @action(detail=False, methods=['post'], url_path='chofer')
    def rutas_chofer(self, request):
        user_id = request.data.get('id')
        camiones = Camion.objects.all().filter(user_id=user_id)
        rutas = Ruta.objects.all().filter(camion__in=camiones, completado=0)
        serializer = RutaSerializer(rutas, many=True)
        return Response(serializer.data)

    # endpoint para marcar como finalizada un surtidor en una ruta
    @action(detail=False, methods=['post'], url_path='entregado')
    def surtidor_entregado(self, request):
        surtidor_id = request.data.get('surtidor_id')
        ruta_id = request.data.get('ruta_id')
        surtidor_ruta = SurtidorRuta.objects.all().filter(ruta_id=ruta_id, surtidor_id=surtidor_id).first()
        if surtidor_ruta is None:
            return Response({'error': 'Surtidor no pertenece a la ruta'}, status=400)
        surtidor_ruta.completado = 1
        surtidor_ruta.save()

        ruta = Ruta.objects.all().filter(id=ruta_id).first()
        url = "http://localhost:8001/api/surtidores/refill/"

        try:
            data = {
                'surtidor_id': surtidor_id,
                'tipo_id': ruta.tipo_combustible,
                'saldo': surtidor_ruta.litros_entrega
            }
            response = requests.post(url, json=data)
            response.raise_for_status()
            response.close()
            return Response({'message': 'Surtidor marcado como entregado'}, status=200)
        except requests.exceptions.RequestException as e:
            surtidor_ruta.completado = 0
            surtidor_ruta.save()
            return Response({'error': f'Error al actualizar saldo combustible a refineria: {e}'}, status=400)
