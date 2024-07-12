from django.contrib.auth.models import User
from django.db import models


class Surtidor(models.Model):
    nombre = models.CharField(max_length=255)
    latitud = models.CharField(max_length=255)
    longitud = models.CharField(max_length=255)
    # n a n con user
    users = models.ManyToManyField(
        User,
        related_name='surtidores_users',
        blank=True,
    )

    def __str__(self):
        return self.nombre