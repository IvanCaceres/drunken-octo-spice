# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0002_auto_20141019_0619'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='address',
            options={'verbose_name_plural': 'Addresses'},
        ),
        migrations.AlterModelOptions(
            name='appointment',
            options={'verbose_name_plural': 'Appointments'},
        ),
        migrations.AlterModelOptions(
            name='business',
            options={'verbose_name_plural': 'Businesses'},
        ),
        migrations.AlterModelOptions(
            name='businesslocation',
            options={'verbose_name_plural': 'Business Locations'},
        ),
        migrations.AlterModelOptions(
            name='businesstype',
            options={'verbose_name_plural': 'Business Types'},
        ),
        migrations.AlterModelOptions(
            name='review',
            options={'verbose_name_plural': 'Reviews'},
        ),
        migrations.AlterModelOptions(
            name='service',
            options={'verbose_name_plural': 'Services'},
        ),
        migrations.AlterModelOptions(
            name='subscriptiontier',
            options={'verbose_name_plural': 'Subscription Tiers'},
        ),
        migrations.AddField(
            model_name='address',
            name='lat',
            field=models.DecimalField(null=True, max_digits=10, decimal_places=6),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='address',
            name='long',
            field=models.DecimalField(null=True, max_digits=10, decimal_places=6),
            preserve_default=True,
        ),
    ]
