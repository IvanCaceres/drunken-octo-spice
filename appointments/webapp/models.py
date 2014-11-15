from django.db import models
from django.conf import settings

AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')

# Create your models here.


class SubscriptionTier(models.Model):
	tier_name = models.CharField(max_length=100)
	cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text='(Optional) Set a cost which will modify the price when this tier is selected.')
	billing_frequency = (
		('M', 'Monthly'),
		('Y', 'Yearly'),
	)
	def __unicode__(self):
		return self.tier_name
	class Meta:
		verbose_name_plural = 'Subscription Tiers'

class BusinessType(models.Model):
	business_type = models.CharField(max_length=40)
	def __unicode__(self):
		return self.business_type
	class Meta:
		verbose_name_plural = 'Business Types'

class Business(models.Model):
	business_type = models.ForeignKey(BusinessType, related_name='type')
	business_name = models.CharField(max_length=200)
	description = models.TextField()
	registered_by = models.ForeignKey(AUTH_USER_MODEL)
	publication_status = models.BooleanField(default=False, help_text="The live status of this business, set to true to display business on site and false to take down.")
	payment_status = models.BooleanField(default=False, help_text="Set to true if all payment invoices are paid.")
	subscription_tier = models.ForeignKey(SubscriptionTier)
	def __unicode__(self):
		return self.business_name
	class Meta:
		verbose_name_plural = 'Businesses'

class BusinessLocation(models.Model):
	business = models.ForeignKey(Business, related_name='locations')
	location_name = models.CharField(max_length=100)
	description = models.TextField()
	slug = models.CharField(max_length=30, null=True)
	# address = models.ForeignKey(Address, related_name)
	def __unicode__(self):
		return self.location_name
	class Meta:
		verbose_name_plural = 'Business Locations'

class Address(models.Model):
	business_location = models.ForeignKey(BusinessLocation, related_name='address', null=True)
	street = models.CharField(max_length=100)
	city = models.CharField(max_length=100)
	state = models.CharField(max_length=40)
	postal_code = models.CharField(max_length=20)
	lat = models.DecimalField(null = True, max_digits = 10, decimal_places = 6)
	long = models.DecimalField(null = True, max_digits = 10, decimal_places = 6)
	def __unicode__(self):
		return self.street
	class Meta:
		verbose_name_plural = 'Addresses'

class Service(models.Model):
	business_location = models.ForeignKey(BusinessLocation)
	name = models.CharField(max_length=100)
	description = models.TextField()
	price_estimate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text='(Optional) Set the estimated price that this service will cost.')
	def __unicode__(self):
		return self.name
	class Meta:
		verbose_name_plural = 'Services'

class Appointment(models.Model):
	business_location = models.ForeignKey(BusinessLocation)
	services = models.ManyToManyField(Service)
	time = models.DateTimeField(auto_now=False)
	service_recipient = models.ForeignKey(AUTH_USER_MODEL)
	completed = models.BooleanField(default=False, help_text="Set to true when appointment has been completed.")
	def __unicode__(self):
		return  u'%s %s %s %s %s' % (self.service_recipient," - ", self.time, " - ", self.business_location)
	class Meta:
		verbose_name_plural = 'Appointments'

class Review(models.Model):
	appointment = models.ForeignKey(Appointment)
	author = models.ForeignKey(AUTH_USER_MODEL)
	rating = (
		(1),
		(2),
		(3),
		(4),
		(5),
	)
	review = models.TextField()
	def __unicode__(self):
		return self.review
	class Meta:
		verbose_name_plural = 'Reviews'
