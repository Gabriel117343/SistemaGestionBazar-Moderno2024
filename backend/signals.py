# backend/signals.py
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Categoria, Producto, Seccion, Proveedor, VentaCategoria, VentaProducto, VentaProveedor, VentaSeccion




# Señales para cambiar actualizar automáticamente el nombre de la instacia de una Venta por categoría, producto, proveedor y sección 

# 1.  Variable global para almacenar el nombre anterior

# 2. before_save se ejecuta antes de guardar la categoria, si la categoria ya existe, se guarda el nombre anterior en la variable global old_name 

# 3.  se accede a la variable global old_name para comparar si el nombre anterior es diferente al nombre actual, solo si es diferente se actualiza el nombre en la instancia

nombre_anterior_categoria = None
nombre_anterior_producto = None
nombre_anterior_seccion = None
nombre_anterior_proveedor = None

@receiver(pre_save, sender=Categoria)
def before_save_categoria(sender, instance, **kwargs):
    global nombre_anterior_categoria
    if instance.pk: # si la categoria ya existe y tiene un id 
        nombre_anterior_categoria = Categoria.objects.get(pk=instance.pk).nombre
    else:
        nombre_anterior_categoria = None

@receiver(post_save, sender=Categoria)
def actualizar_nombre_categoria(sender, instance, **kwargs):
    global nombre_anterior_categoria
    
    if nombre_anterior_categoria and nombre_anterior_categoria != instance.nombre:
        ventas_categoria = VentaCategoria.objects.filter(entidad_id=instance)
        for venta_categoria in ventas_categoria: 
            venta_categoria.nombre = instance.nombre # se reemplaza el nombre de la categoria en la instancia de la venta por categoria con el nuevo nombre
            venta_categoria.save()
    nombre_anterior_categoria = None

@receiver(pre_save, sender=Producto)
def before_save_producto(sender, instance, **kwargs):
    global nombre_anterior_producto
    if instance.pk:
        nombre_anterior_producto = Producto.objects.get(pk=instance.pk).nombre
    else:
        nombre_anterior_producto = None

@receiver(post_save, sender=Producto)
def actualizar_nombre_producto(sender, instance, **kwargs):
    global nombre_anterior_producto
    
    if nombre_anterior_producto and nombre_anterior_producto != instance.nombre:
        ventas_producto = VentaProducto.objects.filter(entidad_id=instance)
        for venta_producto in ventas_producto:
            venta_producto.nombre = instance.nombre
            venta_producto.save()
    nombre_anterior_producto = None

@receiver(pre_save, sender=Seccion)
def before_save_seccion(sender, instance, **kwargs):
    global nombre_anterior_seccion
    if instance.pk:
        nombre_anterior_seccion = Seccion.objects.get(pk=instance.pk).nombre
    else:
        nombre_anterior_seccion = None

@receiver(post_save, sender=Seccion)
def actualizar_nombre_seccion(sender, instance, **kwargs):
    global nombre_anterior_seccion
    
    if nombre_anterior_seccion and nombre_anterior_seccion != instance.nombre:
        ventas_seccion = VentaSeccion.objects.filter(entidad_id=instance)
        for venta_seccion in ventas_seccion:
            venta_seccion.nombre = instance.nombre
            venta_seccion.save()
    nombre_anterior_seccion = None
  
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

