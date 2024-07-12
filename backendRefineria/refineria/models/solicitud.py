from django.db import models


class Solicitud(models.Model):
    surtidor_id = models.IntegerField()
    tipo_combustible = models.IntegerField()
    litros_solicitados = models.IntegerField(default=0)
    isDone = models.BooleanField(default=False)