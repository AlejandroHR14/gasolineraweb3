from rest_framework import serializers, viewsets
from rest_framework.decorators import permission_classes
from rest_framework.response import Response

from refineria.models import Solicitud
from refineria.permissions import permissions


class SolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = '__all__'


class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer

    @permission_classes(permissions.IsAdministradorRefineria)
    def list(self, request, *args, **kwargs):
        queryset = Solicitud.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = SolicitudSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
