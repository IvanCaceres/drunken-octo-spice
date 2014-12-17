# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0008_auto_20141216_0039'),
    ]

    operations = [
        migrations.AlterField(
            model_name='openinghours',
            name='store',
            field=models.ForeignKey(related_name='open_hours', to='webapp.BusinessLocation'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='openinghours',
            unique_together=set([]),
        ),
    ]
