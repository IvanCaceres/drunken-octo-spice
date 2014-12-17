# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0009_auto_20141216_0118'),
    ]

    operations = [
        migrations.AlterField(
            model_name='openinghours',
            name='weekday',
            field=models.IntegerField(choices=[(1, b'Monday'), (2, b'Tuesday'), (3, b'Wednesday'), (4, b'Thursday'), (5, b'Friday'), (6, b'Saturday'), (7, b'Sunday')]),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='openinghours',
            unique_together=set([('weekday', 'store')]),
        ),
    ]
