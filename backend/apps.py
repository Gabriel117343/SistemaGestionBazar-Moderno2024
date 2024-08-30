from django.apps import AppConfig

# El nombre de la aplicación o proyecto de SistemaBazarArica
class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'

    def ready(self):
        import backend.signals # todas las señales de la aplicación backend
