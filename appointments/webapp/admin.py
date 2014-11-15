from django.contrib import admin
from webapp.models import Address, SubscriptionTier, BusinessType, Business, BusinessLocation, Service, Appointment, Review

# Register your models here.
admin.site.register(BusinessType)
admin.site.register(SubscriptionTier)
admin.site.register(Address)
admin.site.register(Appointment)
admin.site.register(Service)
class BusinessLocationInline(admin.StackedInline):
	model = BusinessLocation
	extra = 2
class BusinessAdmin(admin.ModelAdmin):
	inlines = [BusinessLocationInline]
admin.site.register(Business, BusinessAdmin)

class ServiceInline(admin.StackedInline):
	model = Service
	extra = 2
class BusinessLocationAdmin(admin.ModelAdmin):
	inlines = [ServiceInline]
admin.site.register(BusinessLocation, BusinessLocationAdmin)		