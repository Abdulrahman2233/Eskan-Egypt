# Migration to ensure all existing properties have default values

from django.db import migrations


def set_default_values(apps, schema_editor):
    """Set default values for properties without owner/status"""
    Property = apps.get_model('listings', 'Property')
    
    # Update properties with status='draft' to 'approved' (for backward compatibility)
    Property.objects.filter(status='draft').update(status='approved')


def reverse_default_values(apps, schema_editor):
    """Reverse the migration - set back to draft"""
    Property = apps.get_model('listings', 'Property')
    Property.objects.filter(status='approved').update(status='draft')


class Migration(migrations.Migration):

    dependencies = [
        ("listings", "0005_add_approval_fields"),
    ]

    operations = [
        migrations.RunPython(set_default_values, reverse_default_values),
    ]
