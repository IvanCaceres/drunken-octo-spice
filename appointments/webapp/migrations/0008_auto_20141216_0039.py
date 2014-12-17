# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0007_openinghours'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='openinghours',
            unique_together=set([('weekday', 'store')]),
        ),
    ]
