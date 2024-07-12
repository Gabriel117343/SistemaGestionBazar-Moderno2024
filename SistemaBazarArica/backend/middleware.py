# backend/middleware.py

from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from django.urls import resolve
class TokenCleanupMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
  
    def __call__(self, request):
        # Comprobar si la URL es la de actualización del token
        # Resolver la URL para obtener el nombre de la vista
        # Obtener el último segmento de la URL
        last_segment = request.path.rstrip('/').split('/')[-1]
        
        if last_segment == 'refresh':
            print('Último segmento de la URL:', last_segment)
            print('Ha llegado una petición para actualizar el token. Eliminando tokens expirados...')
            self.delete_expired_tokens()
        response = self.get_response(request)
        return response

    def delete_expired_tokens(self):
        # Eliminar tokens expirados
        now = timezone.now()
        expired_outstanding_tokens = OutstandingToken.objects.filter(expires_at__lt=now)
        expired_outstanding_tokens.delete()

        expired_blacklisted_tokens = BlacklistedToken.objects.filter(token__expires_at__lt=now)
        expired_blacklisted_tokens.delete()
