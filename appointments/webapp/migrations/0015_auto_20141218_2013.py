# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0014_auto_20141216_2203'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='when',
            field=models.DateTimeField(default=datetime.datetime(2014, 12, 18, 20, 13, 17, 10361, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
