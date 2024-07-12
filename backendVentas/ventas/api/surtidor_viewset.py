from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ventas.models import Surtidor, Bomba, Combustible
from ventas.permissions import permissions


class SurtidorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Surtidor
        fields = ['id', 'nombre', 'latitud', 'longitud']


class BombaSerializer(serializers.ModelSerializer):
    tipo_id = serializers.IntegerField(write_only=True, required=True)
    tipo = serializers.SerializerMethodField(read_only=True)

    def get_tipo(self, obj):
        if obj is not None:
            return obj.tipo.nombre
        return ""
    class Meta:
        model = Bomba
        fields = ['id', 'codigo', 'surtidor', 'tipo', 'tipo_id']


class CombustibleSerializer(serializers.ModelSerializer):
    tipo_id = serializers.IntegerField(write_only=True, required=True)
    tipo = serializers.SerializerMethodField(read_only=True)

    def get_tipo(self, obj):
        if obj is not None:
            return obj.tipo.nombre
        return ""

    class Meta:
        model = Combustible
        fields = ['id', 'tipo', 'tipo_id', 'saldo', 'surtidor', 'precio']


class SurtidorViewSet(viewsets.ModelViewSet):
    queryset = Surtidor.objects.all()
    serializer_class = SurtidorSerializer

    # list solo para administrador
    @permission_classes(permissions.IsAdministradorSurtidor)
    def list(self, request, *args, **kwargs):
        queryset = Surtidor.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # cuando se obtenga por id, se obtiene el surtidor con sus bombas y combustibles
    @permission_classes(permissions.IsAdministradorSurtidor)
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        # utilizar el serializer de bomba y combustible
        data['bombas'] = BombaSerializer(instance.bombas.all(), many=True).data
        data['combustibles'] = CombustibleSerializer(instance.combustibles.all(), many=True).data
        return Response(data)

    # endpoint para obtener las bombas de un surtidor
    @action(detail=True, methods=['get'], url_path='bombas')
    @permission_classes(permissions.IsVendedor)
    def bombas(self, request, pk=None):
        surtidor = self.get_object()
        bombas = surtidor.bombas.all()
        serializers = BombaSerializer(bombas, many=True)
        return Response(serializers.data)

    # endpoint para obtener el precio actual del producto, para vendedores
    # combustible = Combustible.objects.all().filter(tipo_id=bomba.tipo.id, surtidor_id=surtidor).first()
    @permission_classes(permissions.IsVendedor)
    @action(detail=False, methods=['post'], url_path='precio')
    def precio(self, request):
        surtidor_id = request.data.get('surtidor_id')
        bomba_id = request.data.get('bomba_id')
        if surtidor_id is None:
            return Response({'error': 'surtidor_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        if bomba_id is None:
            return Response({'error': 'bomba_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        bomba = Bomba.objects.all().filter(id=bomba_id).first()
        if bomba is None:
            return Response({'error': 'Bomba no existe'}, status=status.HTTP_400_BAD_REQUEST)
        if int(bomba.surtidor.id) != int(surtidor_id):
            return Response({'error': 'Bomba no pertenece al surtidor seleccionado'},
                            status=status.HTTP_400_BAD_REQUEST)

        combustible = Combustible.objects.all().filter(tipo_id=bomba.tipo.id, surtidor_id=surtidor_id).first()
        precio = combustible.precio

        return Response({'precio': precio})

    @action(detail=False, methods=['post'], url_path='bomba')
    @permission_classes(permissions.IsAdministradorSurtidor)
    def crear_bomba(self, request):
        surtidor_id = request.data.get('surtidor_id')
        codigo = request.data.get('codigo')
        tipo_id = request.data.get('tipo_id')
        if surtidor_id is None:
            return Response({'error': 'surtidor_id is required'}, status=400)
        if codigo is None or codigo == '':
            return Response({'error': 'codigo is required'}, status=400)
        surtidor = Surtidor.objects.all().filter(id=surtidor_id).first()
        if surtidor is None:
            return Response({'error': 'Surtidor no existe'}, status=400)
        bomba = Bomba.objects.create(
            codigo=codigo,
            surtidor=surtidor,
            tipo_id=tipo_id
        )
        serializers = BombaSerializer(bomba)
        return Response(serializers.data)

    @action(detail=False, methods=['post'], url_path='combustible')
    @permission_classes(permissions.IsAdministradorSurtidor)
    def crear_combustible(self, request):
        surtidor_id = request.data.get('surtidor_id')
        tipo_id = request.data.get('tipo_id')
        saldo = request.data.get('saldo')
        precio = request.data.get('precio')
        if surtidor_id is None:
            return Response({'error': 'surtidor_id is required'}, status=400)
        if saldo is None:
            return Response({'error': 'saldo is required'}, status=400)
        surtidor = Surtidor.objects.all().filter(id=surtidor_id).first()
        if surtidor is None:
            return Response({'error': 'Surtidor no existe'}, status=400)
        if precio is None:
            return Response({'error': 'precio is required'}, status=400)

        combustible = Combustible.objects.create(
            saldo=saldo,
            surtidor=surtidor,
            tipo_id=tipo_id,
            precio=precio
        )
        serializers = CombustibleSerializer(combustible)
        return Response(serializers.data)

    @action(detail=False, methods=['post'], url_path='refill')
    def refill(self, request):
        surtidor_id = request.data.get('surtidor_id')
        tipo_id = request.data.get('tipo_id')
        saldo = request.data.get('saldo')

        if surtidor_id is None:
            return Response({'error': 'surtidor_id is required'}, status=400)
        if saldo is None:
            return Response({'error': 'saldo is required'}, status=400)
        surtidor = Surtidor.objects.all().filter(id=surtidor_id).first()
        if surtidor is None:
            return Response({'error': 'Surtidor no existe'}, status=400)
        combustible = Combustible.objects.all().filter(tipo_id=tipo_id, surtidor_id=surtidor_id).first()
        if combustible is None:
            combustible = Combustible.objects.create(
                saldo=saldo,
                surtidor=surtidor,
                tipo_id=tipo_id,
                precio=0
            )
            return Response({'message': 'Combustible creado'}, status=200)
        combustible.saldo += saldo
        combustible.save()
        serializers = CombustibleSerializer(combustible)
        return Response(serializers.data)

    @action(detail=False, methods=['post'], url_path='lista', permission_classes=[AllowAny])
    def lista(self, request):
        tipo_id = request.data.get('tipo_id')

        if tipo_id is None:
            surtidores = Surtidor.objects.all()
        else:
            surtidores = Surtidor.objects.filter(combustibles__tipo_id=tipo_id).distinct()

        surtidores_data = []

        for surtidor in surtidores:
            combustibles = surtidor.combustibles.filter(tipo_id=tipo_id)
            if tipo_id is None:
                combustibles = surtidor.combustibles.all()
            combustibles_data = CombustibleSerializer(combustibles, many=True).data
            total_saldo = sum(combustible['saldo'] for combustible in combustibles_data)

            surtidor_data = {
                "id": surtidor.id,
                "nombre": surtidor.nombre,
                "latitud": surtidor.latitud,
                "longitud": surtidor.longitud,
                "combustibles": combustibles_data,
                "total_saldo": total_saldo
            }

            surtidores_data.append(surtidor_data)

        sorted_surtidores_data = sorted(surtidores_data, key=lambda x: x['total_saldo'], reverse=True)

        return Response(sorted_surtidores_data)