# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('street', models.CharField(max_length=100)),
                ('city', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=40)),
                ('postal_code', models.CharField(max_length=20)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('time', models.TimeField()),
                ('completed', models.BooleanField(default=False, help_text=b'Set to true when appointment has been completed.')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Business',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('business_name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('publication_status', models.BooleanField(default=False, help_text=b'The live status of this business, set to true to display business on site and false to take down.')),
                ('payment_status', models.BooleanField(default=False, help_text=b'Set to true if all payment invoices are paid.')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='BusinessLocation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('location_name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('address', models.ForeignKey(to='webapp.Address')),
                ('business', models.ForeignKey(to='webapp.Business')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='BusinessType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('business_type', models.CharField(max_length=40)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('review', models.TextField()),
                ('appointment', models.ForeignKey(to='webapp.Appointment')),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('price_estimate', models.DecimalField(help_text=b'(Optional) Set the estimated price that this service will cost.', null=True, max_digits=10, decimal_places=2, blank=True)),
                ('business_location', models.ForeignKey(to='webapp.BusinessLocation')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SubscriptionTier',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('tier_name', models.CharField(max_length=100)),
                ('cost', models.DecimalField(help_text=b'(Optional) Set a cost which will modify the price when this tier is selected.', null=True, max_digits=10, decimal_places=2, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='business',
            name='business_type',
            field=models.ForeignKey(to='webapp.BusinessType'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='business',
            name='registered_by',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='business',
            name='subscription_tier',
            field=models.ForeignKey(to='webapp.SubscriptionTier'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='appointment',
            name='business_location',
            field=models.ForeignKey(to='webapp.BusinessLocation'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='appointment',
            name='service_recipient',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='appointment',
            name='services',
            field=models.ManyToManyField(to='webapp.Service'),
            preserve_default=True,
        ),
    ]
