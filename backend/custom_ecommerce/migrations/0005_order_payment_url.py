# Generated by Django 4.2.1 on 2025-06-18 13:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_ecommerce', '0004_alter_transaction_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='payment_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
