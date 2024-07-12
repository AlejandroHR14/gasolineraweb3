from django.db import models

from ventas.models import Surtidor


class Bomba(models.Model):
    codigo = models.CharField(max_length=50)
    tipo = models.ForeignKey('TipoCombustible', related_name='bombas', on_delete=models.CASCADE, null=True)
    surtidor = models.ForeignKey(Surtidor, related_name='bombas', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.codigo} - {self.tipo}'