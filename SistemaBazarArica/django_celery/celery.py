from celery import Celery
from celery.schedules import crontab
from datetime import timedelta
import os
# Celery apunta a la configuración de Django a través de la variable de entorno DJANGO_SETTINGS_MODULE

# ESTE CELERY (No Funciona Todavía)
# PARA ESCALAR EL PROYECTO CON CELERY EN UN FUTURO, SE DEBE CONFIGURAR EL BROKER DE CELERY (RabbitMQ, Redis, etc.), de momento se usará un Middleware para la eliminación de tokens expirados. 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'formulario.settings')
app = Celery('django_celery')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
# Configuración de Celery Beat
app.conf.beat_schedule = {
    'delete-expired-tokens-every-10-seconds': {
      # Ruta completa a la función de tarea
        'task': 'backend.tasks.delete_expired_tokens',
        'schedule': crontab( minute=0, hour=0), # Ejecutar a la medianoche
    },
}

# Descubre y registra tareas desde todas las aplicaciones de Django
app.autodiscover_tasks()

# reemplazar cronolab() con timedelta(seconds=10) para Ejecutar cada 10 segundos(útil para pruebas)
# delete-expired-tokens-every-10-seconds es el nombre de la tarea que se ejecutará cada 10 segundos