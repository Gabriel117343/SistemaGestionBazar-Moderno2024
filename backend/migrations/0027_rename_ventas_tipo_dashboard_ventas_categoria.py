# Generated by Django 5.0.7 on 2024-08-25 06:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0026_remove_categoria_tipo_alter_categoria_nombre'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dashboard',
            old_name='ventas_tipo',
            new_name='ventas_categoria',
        ),
    ]
