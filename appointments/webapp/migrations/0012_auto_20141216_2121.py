# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0011_auto_20141216_2117'),
    ]

    operations = [
        migrations.AlterField(
            model_name='businesslocation',
            name='default_availability',
            field=models.IntegerField(default=0, help_text=b'Enter the availability limit per hour.'),
            preserve_default=True,
        ),
    ]
