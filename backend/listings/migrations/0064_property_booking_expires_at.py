# Generated migration for booking_expires_at field - already exists in DB
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0063_remove_property_booking_duration_hours_and_more'),
    ]

    operations = [
        # booking_expires_at already exists in the database, marking as fake
    ]
