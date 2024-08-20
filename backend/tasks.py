from celery import shared_task
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

# Implementación de Celery para la eliminación de Tokens de acceso expirados en Django Rest Framework (DRF) con Simple JWT del proyecto SistemaBazarArica.

# 1. Configurar Celery en tu proyecto Django.
# 2. Crear una tarea en Celery que haga lo siguiente:
#    a. Consultar la base de datos para encontrar tokens en OutstandingToken y BlacklistedToken que hayan caducado.
#    b. Eliminar esos tokens de la base de datos.
# 3. Programar esta tarea para que se ejecute a intervalos regulares, por ejemplo, diariamente.

@shared_task
def delete_expired_tokens():
    print('- Eliminando tokens expirados...')
    now = timezone.now()
    
    expired_outstanding_tokens = OutstandingToken.objects.filter(expires_at__lt=now)
    expired_blacklisted_tokens = BlacklistedToken.objects.filter(token__expires_at__lt=now)
    
    expired_outstanding_tokens.delete()
    expired_blacklisted_tokens.delete()