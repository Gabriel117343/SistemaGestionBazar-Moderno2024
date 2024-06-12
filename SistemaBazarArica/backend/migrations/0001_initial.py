# Generated by Django 4.2.4 on 2023-12-20 04:21

from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('rut', models.CharField(max_length=13)),
                ('username', models.CharField(blank=True, max_length=50, null=True)),
                ('nombre', models.CharField(max_length=50)),
                ('apellido', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=50, unique=True)),
                ('telefono', models.CharField(max_length=15)),
                ('jornada', models.CharField(choices=[('duirno', 'Duirno'), ('vespertino', 'Vespertino')], default='duirno', max_length=10)),
                ('rol', models.CharField(choices=[('vendedor', 'Vendedor'), ('administrador', 'Administrador')], default='vendedor', max_length=15)),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='imagenes/')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=50, unique=True)),
                ('nombre', models.CharField(blank=True, max_length=50, null=True)),
                ('apellido', models.CharField(blank=True, max_length=50, null=True)),
                ('rut', models.CharField(blank=True, max_length=13, null=True, unique=True)),
                ('telefono', models.CharField(blank=True, max_length=15, null=True)),
                ('direccion', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Descuento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo', models.CharField(max_length=50, unique=True)),
                ('descripcion', models.CharField(max_length=255)),
                ('porcentaje', models.DecimalField(decimal_places=2, max_digits=5)),
                ('valido_desde', models.DateTimeField()),
                ('valido_hasta', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_pedido', models.DateTimeField(auto_now_add=True)),
                ('estado', models.CharField(choices=[('pendiente', 'Pendiente'), ('procesando', 'Procesando'), ('enviado', 'Enviado'), ('entregado', 'Entregado'), ('cancelado', 'Cancelado')], default='pendiente', max_length=20)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.CharField(default='Sin descripción', max_length=255)),
                ('codigo', models.CharField(max_length=50, unique=True)),
                ('tipo', models.CharField(choices=[('aseo', 'Aseo'), ('bebidas', 'Bebidas'), ('carnes', 'Carnes'), ('lacteos', 'Lacteos'), ('pastas', 'Pastas'), ('snacks', 'Snacks'), ('otros', 'Otros')], max_length=20)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='imagenes/')),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('estado', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Proveedor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True, null=True)),
                ('nombre', models.CharField(max_length=100)),
                ('persona_contacto', models.CharField(blank=True, max_length=100, null=True)),
                ('telefono', models.CharField(max_length=15)),
                ('direccion', models.CharField(max_length=50)),
                ('estado', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Seccion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('numero', models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')])),
            ],
        ),
        migrations.CreateModel(
            name='Venta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('fecha_venta', models.DateTimeField(auto_now_add=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.cliente')),
                ('descuento', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='backend.descuento')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.producto')),
                ('vendedor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField(default=0)),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.producto')),
                ('seccion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.seccion')),
            ],
        ),
        migrations.CreateModel(
            name='ProductoRecibido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.PositiveIntegerField()),
                ('fecha_recibido', models.DateTimeField(auto_now=True)),
                ('aceptado', models.BooleanField(default=False)),
                ('observacion', models.TextField(blank=True, null=True)),
                ('pedido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='productos_recibidos', to='backend.pedido')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.producto')),
            ],
        ),
        migrations.CreateModel(
            name='ProductoPedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.PositiveIntegerField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('pedido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='productos', to='backend.pedido')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.producto')),
            ],
        ),
        migrations.AddField(
            model_name='producto',
            name='proveedor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.proveedor'),
        ),
        migrations.AddField(
            model_name='producto',
            name='seccion',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.seccion'),
        ),
        migrations.AddField(
            model_name='pedido',
            name='proveedor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.proveedor'),
        ),
        migrations.AddField(
            model_name='pedido',
            name='usuario',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Movimiento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('tipo', models.CharField(choices=[('entrada', 'Entrada'), ('salida', 'Salida')], max_length=20)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('razon', models.CharField(max_length=255)),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.producto')),
                ('seccion_destino', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movimientos_destino', to='backend.seccion')),
                ('seccion_origen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movimientos_origen', to='backend.seccion')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='descuento',
            name='productos',
            field=models.ManyToManyField(to='backend.producto'),
        ),
    ]
