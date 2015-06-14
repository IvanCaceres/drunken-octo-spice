# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0021_appointment_cars'),
    ]

    operations = [
        migrations.AddField(
            model_name='businesslocation',
            name='cars_serviced',
            field=models.ManyToManyField(to='webapp.CarModel'),
            preserve_default=True,
        ),
    ]
