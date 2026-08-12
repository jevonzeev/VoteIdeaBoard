from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_invite'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Invite',
        ),
    ]
