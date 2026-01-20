"""
Management command to update existing properties with default status
"""
from django.core.management.base import BaseCommand
from listings.models import Property, Area


class Command(BaseCommand):
    help = 'Update existing properties with default values for new fields'

    def handle(self, *args, **kwargs):
        # Update all properties without status to 'approved' (to show them)
        updated_count = Property.objects.filter(status='draft').update(status='approved')
        
        if updated_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully updated {updated_count} properties to approved status')
            )
        else:
            self.stdout.write(
                self.style.WARNING('No properties found with draft status')
            )
        
        # Count properties by status
        stats = {
            'draft': Property.objects.filter(status='draft').count(),
            'pending': Property.objects.filter(status='pending').count(),
            'approved': Property.objects.filter(status='approved').count(),
            'rejected': Property.objects.filter(status='rejected').count(),
        }
        
        self.stdout.write(self.style.SUCCESS('\nProperty Statistics:'))
        for status, count in stats.items():
            self.stdout.write(f'  {status}: {count}')
        
        self.stdout.write(self.style.SUCCESS(f'\nTotal properties: {Property.objects.count()}'))
