# Generated by Django 4.2.4 on 2024-06-17 04:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0011_producto_hash'),
    ]

    operations = [
        migrations.AddField(
            model_name='venta',
            name='info_venta_producto_id',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='venta',
            name='info_venta_tipo',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
