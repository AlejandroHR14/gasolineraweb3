import requests
from django.db.models.signals import post_save
from django.dispatch import receiver

from refineria.models import SurtidorRuta, Solicitud, Ruta


# cada que se actualice un surtidor_ruta, verificar si todos los surtidores de la ruta estan completados
@receiver(post_save, sender=SurtidorRuta)
def verificar_ruta_completada(sender, instance, created, **kwargs):
    ruta = instance.ruta
    surtidores = SurtidorRuta.objects.all().filter(ruta=ruta)
    completados = surtidores.filter(completado=1)
    if completados.count() == surtidores.count():
        ruta.completado = 1
        ruta.save()
        print(f"Ruta {ruta.nombre} completada")
    else:
        ruta.completada = 0
        ruta.save()
        print(f"Ruta {ruta.nombre} incompleta")


@receiver(post_save, sender=Solicitud)
def verificar_surtidor_en_rutas(sender, instance, created, **kwargs):
    surtidor_id = instance.surtidor_id
    tipo_combustible = instance.tipo_combustible
    rutasPorTipo = Ruta.objects.all().filter(tipo_combustible=tipo_combustible)
    for ruta in rutasPorTipo:
        surtidores = SurtidorRuta.objects.all().filter(ruta=ruta)
        for surtidor in surtidores:
            if surtidor.surtidor_id == surtidor_id and surtidor.completado == 0:
                surtidor.urgente = 1
                surtidor.save()
                print(f"Surtidor {surtidor_id} en ruta {ruta.nombre} marcado como urgente")
                break