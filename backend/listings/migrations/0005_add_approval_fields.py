# Generated migration to add approval fields to Property model

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
        ("listings", "0004_property_usage_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="property",
            name="status",
            field=models.CharField(
                choices=[
                    ("draft", "مسودة"),
                    ("pending", "معلق"),
                    ("approved", "موافق عليه"),
                    ("rejected", "مرفوض"),
                ],
                default="draft",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="owner",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="properties",
                to="users.userprofile",
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="submitted_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="property",
            name="approved_by",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="approved_properties",
                to="users.userprofile",
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="approval_notes",
            field=models.TextField(blank=True),
        ),
    ]
