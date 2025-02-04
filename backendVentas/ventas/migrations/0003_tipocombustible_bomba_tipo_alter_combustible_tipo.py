# Generated by Django 5.0.4 on 2024-07-11 22:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0002_venta'),
    ]

    operations = [
        migrations.CreateModel(
            name='TipoCombustible',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name='bomba',
            name='tipo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='bombas', to='ventas.tipocombustible'),
        ),
        migrations.AlterField(
            model_name='combustible',
            name='tipo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='combustibles', to='ventas.tipocombustible'),
        ),
    ]
