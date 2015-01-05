from django.forms import widgets
from rest_framework import serializers
from webapp.models import Business, BusinessType, BusinessLocation, Address, Appointment, OpeningHours, Availability, CarMake, Year, CarModel, UserCar, ServiceOffered, Service
from django.contrib.auth.models import User
 
class OldUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name',
                  'last_name', 'email')
        read_only_fields = ('id',)
        write_only_fields = ('password',)

    def restore_object(self, attrs, instance=None):
        user = super(OldUserSerializer, self).restore_object(attrs, instance)
        user.set_password(attrs['password'])
        return user
 
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username', 'password', 'first_name', 'last_name', 'email')
        read_only_fields = ('id',)
        write_only_fields = ('password',)
 
    def create(self, validated_data):
    	# self.validated_data['id'] = 100
        # call set_password on user object. Without this
        # the password will be stored in plain text.
        password = validated_data.get('password', None)
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(password)
        user.save()
        return user
    def update(self, instance, validated_data):
        password = validated_data.get('password', None)
        # call set_password on user object. Without this
        # the password will be stored in plain text.
        user = super(UserSerializer, self).update(validated_data, instance)
        user.set_password(password)
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
class AvailabilitySerializer(serializers.ModelSerializer):
	class Meta:
		model = Availability
		fields = ('store','date','count')

class ServiceSerializer(serializers.ModelSerializer):
    # service_offered = ServiceOfferedSerializer(many=False)
    class Meta:
        model = Service
        fields = ('id','name','description')

class ServiceOfferedSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(many=False)
    class Meta:
        model = ServiceOffered

class BusinessLocationSerializer(serializers.ModelSerializer):
    business = BusinessSerializer(many=False)
    open_hours = OpeningHoursSerializer(many=True)
    availability = AvailabilitySerializer(many=True)
    services = ServiceSerializer(many=True)
    service_offered = ServiceOfferedSerializer(many=True)
    class Meta:
        model = BusinessLocation
        fields = ('business', 'location_name', 'description', 'id', 'slug', 'address', 'open_hours', 'availability', 'default_availability', 'services', 'service_offered')

class AddressSerializer(serializers.ModelSerializer):
	business_location = BusinessLocationSerializer(many=False)
	class Meta:
		model = Address
		fields = ('street', 'id', 'city', 'state', 'postal_code', 'lat', 'long', 'business_location')

class AppointmentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Appointment
		fields = ('availability' , 'business_location', 'services', 'when', 'service_recipient', 'completed', 'cars')

class CarMakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarMake
        fields = ('id','name')        

class YearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Year
        fields = ('id','year')

class CarModelSerializer(serializers.ModelSerializer):
    year = YearSerializer()
    make = CarMakeSerializer()
    class Meta:
        model = CarModel
        fields = ('id','year', 'make', 'model')

class UserCarCreateSerializer(serializers.ModelSerializer):
    # model = CarModelSerializer()
    class Meta:
        model = UserCar
        fields = ('id','user','model')

class UserCarSerializer(serializers.ModelSerializer):
    model = CarModelSerializer()
    class Meta:
        model = UserCar
        fields = ('id','user','model')        





