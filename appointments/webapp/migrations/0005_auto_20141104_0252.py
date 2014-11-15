# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0004_auto_20141104_0034'),
    ]

    operations = [
        migrations.AddField(
            model_name='businesslocation',
            name='slug',
            field=models.CharField(max_length=30, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='business',
            name='business_type',
            field=models.ForeignKey(related_name=b'type', to='webapp.BusinessType'),
        ),
    ]
