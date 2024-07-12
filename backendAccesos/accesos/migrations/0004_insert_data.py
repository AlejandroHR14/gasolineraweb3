from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accesos', '0001_initial'),
    ]

    def insertData(apps, schema_editor):
        Group = apps.get_model('auth', 'Group')

        admin_group = Group(name='Administrador de Accesos')
        admin_group.save()

        client_group = Group(name='Administrador de refinería')
        client_group.save()

        client_group = Group(name='Administrador de surtidor')
        client_group.save()

        client_group = Group(name='Vendedor')
        client_group.save()

        client_group = Group(name='Chofer')
        client_group.save()

    operations = [
        migrations.RunPython(insertData),
    ]