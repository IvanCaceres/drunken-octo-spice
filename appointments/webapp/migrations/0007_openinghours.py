# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0006_auto_20141214_2020'),
    ]

    operations = [
        migrations.CreateModel(
            name='OpeningHours',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('weekday', models.IntegerField(unique=True, choices=[(1, b'Monday'), (2, b'Tuesday'), (3, b'Wednesday'), (4, b'Thursday'), (5, b'Friday'), (6, b'Saturday'), (7, b'Sunday')])),
                ('from_hour', models.TimeField()),
                ('to_hour', models.TimeField()),
                ('store', models.ForeignKey(to='webapp.BusinessLocation')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
