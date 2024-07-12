from django.db import models


class Surtidor(models.Model):
    nombre = models.CharField(max_length=255)
    latitud = models.CharField(max_length=255)
    longitud = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre