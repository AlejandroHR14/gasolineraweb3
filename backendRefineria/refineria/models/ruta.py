from django.db import models

from refineria.models import Camion


class Ruta(models.Model):
    nombre = models.CharField(max_length=100)
    fecha = models.DateField()
    camion = models.ForeignKey(Camion, on_delete=models.CASCADE)
    litros_combustible = models.FloatField()
    tipo_combustible = models.CharField(max_length=50)
    precio_por_litro = models.FloatField()
    completado = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre