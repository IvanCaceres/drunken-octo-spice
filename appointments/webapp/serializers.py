from django.forms import widgets
from rest_framework import serializers
from webapp.models import Business, BusinessType, BusinessLocation, Address


class BusinessTypeSerializer(serializers.ModelSerializer):
	class Meta:
		model = BusinessType
		fields = ('business_type', 'id',)

class BusinessSerializer(serializers.ModelSerializer):
	type = serializers.RelatedField(source='business_type')
	# locations = BusinessLocationSerializer(many=True)
	class Meta:
		model = Business
		fields = ('type', 'business_name', 'description', 'registered_by', 'publication_status', 'payment_status')		

class BusinessLocationSerializer(serializers.ModelSerializer):
	business = BusinessSerializer(many=False)
	class Meta:
		model = BusinessLocation
		fields = ('business', 'location_name', 'description', 'id', 'slug', 'address')

class AddressSerializer(serializers.ModelSerializer):
	business_location = BusinessLocationSerializer(many=False)
	class Meta:
		model = Address
		fields = ('street', 'id', 'city', 'state', 'postal_code', 'lat', 'long', 'business_location')		




