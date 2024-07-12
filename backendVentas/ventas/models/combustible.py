from django.db import models

from ventas.models import Surtidor


class Combustible(models.Model):
    tipo = models.ForeignKey('TipoCombustible', related_name='combustibles', on_delete=models.CASCADE)
    surtidor = models.ForeignKey(Surtidor, related_name='combustibles', on_delete=models.CASCADE)
    precio = models.FloatField(default=0)
    saldo = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.tipo} - {self.surtidor}'