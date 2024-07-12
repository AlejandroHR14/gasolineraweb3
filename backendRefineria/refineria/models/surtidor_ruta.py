from django.db import models

from refineria.models import Ruta


class SurtidorRuta(models.Model):
    ruta = models.ForeignKey(Ruta, related_name='surtidores', on_delete=models.CASCADE)
    surtidor_id = models.IntegerField()
    litros_entrega = models.FloatField()
    completado = models.BooleanField(default=False)
    urgente = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.ruta.nombre} - {self.surtidor_id}'