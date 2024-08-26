from django.db import migrations

def migrate_tipo_to_categoria(apps, schema_editor):
    Producto = apps.get_model('backend', 'Producto')
    Categoria = apps.get_model('backend', 'Categoria')

    for producto in Producto.objects.all():
        categoria, created = Categoria.objects.get_or_create(nombre=producto.tipo)
        producto.categoria = categoria
        producto.save()

class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0022_categoria_producto_categoria'),
    ]

    operations = [
        migrations.RunPython(migrate_tipo_to_categoria),
    ]