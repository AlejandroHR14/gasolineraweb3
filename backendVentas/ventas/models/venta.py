from django.db import models

from ventas.models import Bomba, Combustible, Surtidor


class Venta(models.Model):
    nombre_factura = models.CharField(max_length=255)
    nit_factura = models.CharField(max_length=20)
    cliente = models.CharField(max_length=255)
    correo = models.EmailField()
    surtidor = models.ForeignKey(Surtidor, on_delete=models.CASCADE, null=True)
    bomba = models.ForeignKey(Bomba, on_delete=models.CASCADE)
    monto = models.FloatField(default=0)
    precio_actual_producto = models.FloatField()
    cantidad_producto = models.IntegerField()
    tipo_producto = models.CharField(max_length=255)
    fecha_hora = models.DateTimeField(auto_now_add=True)
    isDeleted = models.BooleanField(default=False)