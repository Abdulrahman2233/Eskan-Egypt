# Generated migration for adding beds field to Property model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0011_remove_property_type_alter_property_contact'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='beds',
            field=models.IntegerField(default=1),
        ),
    ]
