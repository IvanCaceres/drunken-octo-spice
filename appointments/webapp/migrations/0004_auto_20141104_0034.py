# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0003_auto_20141101_2220'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='businesslocation',
            name='address',
        ),
        migrations.AddField(
            model_name='address',
            name='business_location',
            field=models.ForeignKey(related_name=b'address', to='webapp.BusinessLocation', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='appointment',
            name='time',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='businesslocation',
            name='business',
            field=models.ForeignKey(related_name=b'locations', to='webapp.Business'),
        ),
    ]
