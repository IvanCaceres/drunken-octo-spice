from django.contrib import admin
from webapp.models import Address, SubscriptionTier, BusinessType, Business, BusinessLocation, Service, Appointment, Review, OpeningHours, Availability, CarMake, Year, CarModel, CarBodyStyle
from import_export import resources
from import_export.admin import ImportExportModelAdmin

# Register your models here.
admin.site.register(BusinessType)
admin.site.register(SubscriptionTier)
admin.site.register(Address)
admin.site.register(Appointment)
admin.site.register(Service)
admin.site.register(OpeningHours)
admin.site.register(Availability)
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


class CarMakeResource(resources.ModelResource):

    class Meta:
        model = CarMake

class CarMakeAdmin(ImportExportModelAdmin):
    resource_class = CarMakeResource
    pass

admin.site.register(CarMake, CarMakeAdmin)

class YearResource(resources.ModelResource):

    class Meta:
        model = Year

class YearAdmin(ImportExportModelAdmin):
    resource_class = YearResource
    pass
admin.site.register(Year, YearAdmin)

class CarModelResource(resources.ModelResource):

    class Meta:
        model = CarModel

class CarModelAdmin(ImportExportModelAdmin):
    resource_class = CarModelResource
    pass
admin.site.register(CarModel, CarModelAdmin)

class CarBodyResource(resources.ModelResource):

    class Meta:
        model = CarBodyStyle

class CarBodyStyleAdmin(ImportExportModelAdmin):
    resource_class = CarBodyResource
    pass
admin.site.register(CarBodyStyle, CarBodyStyleAdmin)