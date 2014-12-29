# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0020_usercar'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='cars',
            field=models.ManyToManyField(to='webapp.UserCar'),
            preserve_default=True,
        ),
    ]
