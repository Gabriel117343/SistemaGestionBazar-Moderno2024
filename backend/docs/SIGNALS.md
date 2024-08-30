# Documentación de Señales para Actualización Automática de Nombres en Ventas

Este archivo contiene señales de Django que se utilizan para actualizar automáticamente los nombres de las instancias de ventas cuando se actualizan las instancias de categorías, proveedores, secciones, etc.

## Ejemplo de Actualización para Proveedor

Cuando se actualiza el nombre de una instancia de `Proveedor`, las señales `pre_save` y `post_save` aseguran que todas las instancias de `VentaProveedor` relacionadas se actualicen automáticamente con el nuevo nombre.

```python
@receiver(pre_save, sender=Proveedor)
def before_save_proveedor(sender, instance, **kwargs):
    global nombre_anterior_proveedor
    if instance.pk:
        nombre_anterior_proveedor = Proveedor.objects.get(pk=instance.pk).nombre
    else:
        nombre_anterior_proveedor = None

@receiver(post_save, sender=Proveedor)
def actualizar_nombre_proveedor(sender, instance, **kwargs):
    global nombre_anterior_proveedor
    if nombre_anterior_proveedor and nombre_anterior_proveedor != instance.nombre:
        ventas_proveedor = VentaProveedor.objects.filter(entidad_id=instance)
        for venta_proveedor in ventas_proveedor:
            venta_proveedor.nombre = instance.nombre
            venta_proveedor.save()
    nombre_anterior_proveedor = None
```
En este ejemplo, si el nombre de un Proveedor cambia de "Proveedor A" a "Proveedor B", todas las instancias de VentaProveedor relacionadas se actualizarán automáticamente para reflejar el nuevo nombre "Proveedor B".

### Resumen

Estas señales aseguran que cuando se actualiza el nombre de una instancia de Categoria, Seccion, Proveedor o Producto todas las instancias de ventas relacionadas se actualizan automáticamente con el nuevo nombre. Esto mantiene la consistencia de los datos en la base de datos y evita la necesidad de actualizaciones manuales en múltiples tablas.