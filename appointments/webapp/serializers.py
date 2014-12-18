from django.forms import widgets
from rest_framework import serializers
from webapp.models import Business, BusinessType, BusinessLocation, Address, Appointment, OpeningHours
from django.contrib.auth.models import User
 
 
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email')
        read_only_fields = ('id',)
        write_only_fields = ('password',)
 
    def restore_object(self, attrs, instance=None):
        # call set_password on user object. Without this
        # the password will be stored in plain text.
        user = super(UserSerializer, self).restore_object(attrs, instance)
        user.set_password(attrs['password'])
        return user

class BusinessTypeSerializer(serializers.ModelSerializer):
	class Meta:
		model = BusinessType
		fields = ('business_type', 'id',)

class BusinessSerializer(serializers.ModelSerializer):
	# type = serializers.RelatedField(source='business_type')
	business_type = BusinessTypeSerializer(many=False)
	# locations = BusinessLocationSerializer(many=True)
	class Meta:
		model = Business
		fields = ('business_type', 'business_name', 'description', 'registered_by', 'publication_status', 'payment_status')

class OpeningHoursSerializer(serializers.ModelSerializer):
	class Meta:
		model = OpeningHours
		fields = ('store', 'weekday', 'from_hour', 'to_hour')				

class BusinessLocationSerializer(serializers.ModelSerializer):
	business = BusinessSerializer(many=False)
	open_hours = OpeningHoursSerializer(many=True)
	class Meta:
		model = BusinessLocation
		fields = ('business', 'location_name', 'description', 'id', 'slug', 'address', 'open_hours')

class AddressSerializer(serializers.ModelSerializer):
	business_location = BusinessLocationSerializer(many=False)
	class Meta:
		model = Address
		fields = ('street', 'id', 'city', 'state', 'postal_code', 'lat', 'long', 'business_location')

class AppointmentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Appointment
		fields = ('availability' , 'business_location', 'services', 'when', 'service_recipient', 'completed')




