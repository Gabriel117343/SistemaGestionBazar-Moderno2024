# Generated by Django 5.0.7 on 2024-08-24 22:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0019_alter_venta_info_venta_json'),
    ]

    operations = [
        migrations.AlterField(
            model_name='venta',
            name='info_venta_json',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
