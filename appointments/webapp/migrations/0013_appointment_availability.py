# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0012_auto_20141216_2121'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='availability',
            field=models.ForeignKey(related_name='appointment', default=1, to='webapp.Availability'),
            preserve_default=True,
        ),
    ]
