# from django_celery.celery import app as celery_app

# # __all__ asegurar que cuando se importe el módulo, la instancia de la aplicación Celery se importará automáticamente.
# # Initializa Celery con la configuración de Django. 
# __all__ = ('celery_app',)

# default_app_config es una variable que se utiliza para configurar la aplicación de Django.
default_app_config = 'backend.apps.BackendConfig' 