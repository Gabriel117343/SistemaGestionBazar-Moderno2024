from django.contrib import admin
from django.contrib import messages
from .models import *
# Register your models here.

admin.site.site_header = 'Administración de Sistema Bazar Arica' # título del administrador # esto es para cambiar el título del administrador


admin.site.register(Cliente)
admin.site.register(Producto)
admin.site.register(Categoria)
admin.site.register(ProductoPedido)
admin.site.register(Pedido)
admin.site.register(Descuento)
admin.site.register(Venta)
admin.site.register(Seccion)
admin.site.register(Movimiento)
admin.site.register(Proveedor)
admin.site.register(Stock)

admin.site.register(VentaProducto)
admin.site.register(VentaProveedor)
admin.site.register(VentaCategoria)
admin.site.register(VentaSeccion)




@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'rut', 'nombre', 'apellido', 'email', 'telefono', 'jornada', 'rol') # campos a mostrar en la tabla de usuarios en el admin
    list_filter = ('rol',) # filtro por rol
    search_fields = ('rut', 'nombre', 'apellido', 'email', 'telefono', 'jornada', 'rol') # búsqueda por rut, nombre, apellido, email, telefono, jornada y rol
    list_per_page = 10 # paginación de 10 en 10 
    
    