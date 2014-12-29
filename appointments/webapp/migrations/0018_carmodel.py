# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0017_year'),
    ]

    operations = [
        migrations.CreateModel(
            name='CarModel',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('model', models.CharField(max_length=50)),
                ('make', models.ForeignKey(to='webapp.CarMake')),
                ('year', models.ForeignKey(to='webapp.Year')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
