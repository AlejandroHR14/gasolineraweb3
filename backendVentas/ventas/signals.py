import requests
from django.db.models.signals import post_save
from django.dispatch import receiver

from ventas.models import Venta, Combustible

@receiver(post_save, sender=Venta)
def verificar_saldo_combustible(sender, instance, created, **kwargs):
    combustible = Combustible.objects.all().filter(tipo_id=instance.bomba.tipo.id, surtidor_id=instance.surtidor.id).first()
    if created:
        if combustible.saldo < 100:
            url = "http://localhost:8002/api/solicitudes/"
            data = {
                "surtidor_id": instance.surtidor.id,
                "tipo_combustible": instance.bomba.tipo.id,
                "litros_solicitados": 100
            }
            try:
                response = requests.post(url, json=data)
                response.raise_for_status()
                response.close()
                print(f"Combustible {combustible.tipo} en surtido {combustible.surtidor} con saldo menor a 100, enviado a refineria. Tiene de saldo {combustible.saldo}")
            except requests.exceptions.RequestException as e:
                print(f"Error al enviar combustible a refineria: {e}")

