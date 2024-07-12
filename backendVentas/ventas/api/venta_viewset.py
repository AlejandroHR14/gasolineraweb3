from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response

from ventas.models import Venta, Surtidor, Bomba, Combustible
from ventas.permissions import permissions


class VentaSerializer(serializers.ModelSerializer):
    tipo_producto = serializers.CharField(read_only=True)

    class Meta:
        model = Venta
        fields = '__all__'


class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer

    # admin
    @permission_classes(permissions.IsAdministradorSurtidor)
    def list(self, request, *args, **kwargs):
        queryset = Venta.objects.all().filter(isDeleted=False).order_by('-fecha_hora')
        serializer = VentaSerializer(queryset, many=True)
        for venta in serializer.data:
            surtidor = Surtidor.objects.all().filter(id=venta['surtidor']).first()
            if surtidor is not None:
                venta['surtidor'] = surtidor.nombre

        return Response(serializer.data)

    # vendedor
    @permission_classes(permissions.IsVendedor)
    def create(self, request, *args, **kwargs):
        serializer = VentaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        nombre_factura = request.data.get('nombre_factura')
        nit_factura = request.data.get('nit_factura')
        cliente = request.data.get('cliente')
        correo = request.data.get('correo')
        surtidor_id = request.data.get('surtidor')
        bomba_id = request.data.get('bomba')
        monto = request.data.get('monto')
        precio_actual_producto = request.data.get('precio_actual_producto')
        cantidad_producto = request.data.get('cantidad_producto')

        if surtidor_id != '':
            surtidor = Surtidor.objects.all().filter(id=surtidor_id).first()
            if surtidor is None:
                return Response({'error': 'Surtidor no existe'}, status=status.HTTP_400_BAD_REQUEST)
        # validar que la bomba sea del surtidor seleccionado
        bomba = Bomba.objects.all().filter(id=bomba_id).first()
        if bomba is None:
            return Response({'error': 'Bomba no existe'}, status=status.HTTP_400_BAD_REQUEST)
        if int(bomba.surtidor.id) != int(surtidor_id):
            return Response({'error': 'Bomba no pertenece al surtidor seleccionado'},
                            status=status.HTTP_400_BAD_REQUEST)
        if not nombre_factura:
            return Response({'error': 'Nombre de factura es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if not nit_factura:
            return Response({'error': 'Nit de factura es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if not cliente:
            return Response({'error': 'Cliente es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if not correo:
            return Response({'error': 'Correo es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if not monto:
            return Response({'error': 'Monto es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if not cantidad_producto:
            return Response({'error': 'Cantidad de producto es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if int(cantidad_producto) <= 0:
            return Response({'error': 'Cantidad de producto debe ser mayor a 0'}, status=status.HTTP_400_BAD_REQUEST)

        combustible = Combustible.objects.all().filter(tipo_id=bomba.tipo.id, surtidor_id=surtidor).first()
        if int(combustible.saldo) < int(cantidad_producto):
            mensaje = 'No hay suficiente producto, saldo actual: ' + str(combustible.saldo)
            return Response({'error': mensaje}, status=status.HTTP_400_BAD_REQUEST)
        else:
            combustible.saldo = combustible.saldo - int(cantidad_producto)
            combustible.save()

        venta = Venta.objects.create(
            nombre_factura=nombre_factura,
            nit_factura=nit_factura,
            cliente=cliente,
            correo=correo,
            surtidor=surtidor,
            bomba=bomba,
            monto=monto,
            precio_actual_producto=precio_actual_producto,
            cantidad_producto=cantidad_producto,
            tipo_producto=bomba.tipo
        )

        return Response({'success': 'Venta creada'}, status=status.HTTP_201_CREATED)

    # lista de ventas por surtidor - para vendedores
    @permission_classes(permissions.IsVendedor)
    @action(detail=False, methods=['post'], url_path='surtidor')
    def surtidor(self, request):
        surtidor_id = request.data.get('surtidor_id')
        if surtidor_id is None:
            return Response({'error': 'surtidor_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        ventas = Venta.objects.all().filter(surtidor_id=surtidor_id, isDeleted=False).order_by('-fecha_hora')
        serializer = VentaSerializer(ventas, many=True)
        for venta in serializer.data:
            surtidor = Surtidor.objects.all().filter(id=venta['surtidor']).first()
            if surtidor is not None:
                venta['surtidor'] = surtidor.nombre

        return Response(serializer.data)

    # para administradores
    @action(detail=True, methods=['post'], url_path='anular')
    @permission_classes(permissions.IsAdministradorSurtidor)
    def anular(self, request, pk=None):
        venta = self.get_object()
        venta.isDeleted = True
        venta.save()

        combustible = Combustible.objects.all().filter(tipo_id=venta.bomba.tipo.id, surtidor_id=venta.surtidor).first()
        combustible.saldo = combustible.saldo + int(venta.cantidad_producto)
        combustible.save()

        return Response({'success': 'Venta anulada'}, status=status.HTTP_200_OK)
