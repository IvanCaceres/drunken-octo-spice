# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0010_auto_20141216_0119'),
    ]

    operations = [
        migrations.CreateModel(
            name='Availability',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('count', models.IntegerField()),
                ('date', models.DateTimeField(null=True, blank=True)),
                ('store', models.ForeignKey(related_name='availability', to='webapp.BusinessLocation')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='businesslocation',
            name='default_availability',
            field=models.IntegerField(default=10, help_text=b'Enter the availability limit per hour.'),
            preserve_default=True,
        ),
    ]
