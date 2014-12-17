# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0013_appointment_availability'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='availability',
            field=models.ForeignKey(related_name='appointment', to='webapp.Availability'),
            preserve_default=True,
        ),
    ]
