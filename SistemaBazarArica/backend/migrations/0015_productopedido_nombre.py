# Generated by Django 4.2.4 on 2024-06-28 20:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0014_alter_pedido_observacion'),
    ]

    operations = [
        migrations.AddField(
            model_name='productopedido',
            name='nombre',
            field=models.CharField(default='Sin nombre', max_length=100),
        ),
    ]
