from django.db import models

class Camion(models.Model):
    nombre = models.CharField(max_length=100)
    capacidad = models.FloatField()  # Capacidad del camión en litros
    tipo_combustible = models.ForeignKey('TipoCombustible', on_delete=models.CASCADE)
    user_id = models.IntegerField(default=0)

    def __str__(self):
        return self.nombre