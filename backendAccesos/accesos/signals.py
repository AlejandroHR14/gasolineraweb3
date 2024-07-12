import requests
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from accesos.models import Surtidor


@receiver(post_save, sender=Surtidor)
def crear_surtidor_en_ventas(sender, instance, created, **kwargs):
    url = "http://localhost:8001/api/surtidores/"
    data = {
        "id": instance.id,
        "nombre": instance.nombre,
        "latitud": str(instance.latitud),
        "longitud": str(instance.longitud)
    }
    try:
        if created:
            # Crear un nuevo surtidor en el backend de ventas
            response = requests.post(url, json=data)
            response.raise_for_status()
            response.close()
            print(f"Surtidor creado en ventas: {response.json()}")
        else:
            # Actualizar el surtidor existente en el backend de ventas
            response = requests.put(f"{url}{instance.id}/", json=data)
            response.raise_for_status()
            response.close()
            print(f"Surtidor actualizado en ventas: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Error al sincronizar el surtidor en ventas: {e}")


@receiver(post_delete, sender=Surtidor)
def eliminar_surtidor_en_ventas(sender, instance, **kwargs):
    url = f"http://localhost:8001/api/surtidores/{instance.id}/"

    try:
        response = requests.delete(url)
        response.raise_for_status()
        print(f"Surtidor eliminado en ventas: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error al eliminar el surtidor en ventas: {e}")
