# Generated by Django 5.0.4 on 2024-07-11 23:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0003_tipocombustible_bomba_tipo_alter_combustible_tipo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='venta',
            name='tipo_producto',
            field=models.CharField(max_length=255),
        ),
    ]
