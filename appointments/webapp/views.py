from webapp.models import Business, BusinessType, BusinessLocation, Address, Appointment, Availability
from webapp.serializers import BusinessSerializer, BusinessTypeSerializer, BusinessLocationSerializer, AddressSerializer, UserSerializer, AppointmentSerializer, AvailabilitySerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from geopy import distance
from django.db import connection
from django.contrib.auth import login, logout
from authentication import QuietBasicAuthentication
from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework.permissions import AllowAny
from permissions import IsStaffOrTargetUser, IsOwnerOrReadOnly
from rest_framework.exceptions import ParseError, APIException
import dateutil.parser
class ServiceRejected(APIException):
    status_code = 400
    default_detail = 'Service temporarily unavailable, try again later.'

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    model = User
 
    def get_permissions(self):
        # allow non-authenticated user to create via POST
        return (AllowAny() if self.request.method == 'POST'
                else IsStaffOrTargetUser()),

class AuthView(APIView):
    authentication_classes = (QuietBasicAuthentication,)
 
    def post(self, request, *args, **kwargs):
        login(request, request.user)
        return Response(UserSerializer(request.user).data)
 
    def delete(self, request, *args, **kwargs):
        logout(request)
        return Response({})

class type_list(generics.ListAPIView):
	serializer_class = BusinessTypeSerializer
	def get_queryset(self):
		queryset = BusinessType.objects.all()
		return queryset
		
class AppointmentViewSet(viewsets.ModelViewSet):
	queryset = Appointment.objects.all()
	serializer_class = AppointmentSerializer
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)
	def perform_create(self, serializer):
		# serializer = AppointmentSerializer(data=request.data)
		# return serializer
		serializer.validated_data['service_recipient'] = self.request.user
		avQueryset = Availability.objects.filter(date__range=(serializer.validated_data['when'], serializer.validated_data['when']), store_id=serializer.validated_data['business_location'].id)
		r = list(avQueryset[:1])
		userCheck = avQueryset.filter(appointment__service_recipient = self.request.user)
		if userCheck.exists():
			raise APIException('you have already booked an appointment for this time slot at this location')
		if r:
			if r[0].count > 0 :
				###set the availability object####
				serializer.validated_data['availability'] = r[0]
				serializer.save()
				newCount = r[0].count - 1
				a = Availability.objects.get(id=r[0].id)
				a.count = newCount
				a.save()
			else:
				raise Exception('there is no more room')
		else:
			###get business location  to determine the default availability count###
			bL = BusinessLocation.objects.get(id=serializer.validated_data['business_location'].id)
			###create availability object since none was found###
			aV = Availability.objects.create(date=serializer.validated_data['when'], count= bL.default_availability, store=bL)
			newCount = aV.count - 1
			aV.count = newCount
			aV.save()
			serializer.validated_data['availability'] = aV
			serializer.save()
			# raise Exception('Bang there is no more room')
		# raise Exception('lol')
		return serializer
		APIException()
		return Response(serializer.errors,
			status=status.HTTP_400_BAD_REQUEST)

class AvailabilityViewSet(viewsets.ModelViewSet):
	queryset = Availability.objects.all()
	serializer_class = AvailabilitySerializer
	def get_queryset(self):
		"""
		Filter the availabilities
		"""
		queryset = Availability.objects.all()
		when = self.request.QUERY_PARAMS.get('when', None)
		business_ids = self.request.QUERY_PARAMS.get('business_id', None)
		if business_ids is not None:
			business_ids = business_ids.split(',')
			queryset = queryset.filter(store__in=[business_id for business_id in business_ids])
		if when is not None:
			queryset = queryset.filter(date__range=(when, when))
		return queryset
class address_list(generics.ListAPIView):

	serializer_class = AddressSerializer
	@csrf_exempt
	def get_queryset(self):
		"""
		List all addresses.
		"""
		queryset = Address.objects.all()
		addresses = queryset
		distanceParam = self.request.QUERY_PARAMS.get('distance', None)
		requestDate = self.request.QUERY_PARAMS.get('date', None)
		business_type = self.request.QUERY_PARAMS.get('business_type', None)
		#first float must be Latitude, second float longitude
		locationParam = self.request.QUERY_PARAMS.get('location', None)
		
		if distanceParam is not None and locationParam is not None:
			# cursor = connection.cursor()
			# locationParam = str(locationParam)
			locationParam = locationParam.split(',')
			# testfloat = 40.796520
			sqlString = "SELECT id, ( 3959 * acos( cos( radians(" + locationParam[0] + ") ) * cos( radians( lat ) ) * cos( radians( long ) - radians("+locationParam[1]+") ) + sin( radians(" + locationParam[0] + ") ) * sin( radians( lat ) ) ) ) AS distance FROM webapp_address GROUP BY id HAVING ( 3959 * acos( cos( radians(" + locationParam[0] + ") ) * cos( radians( lat ) ) * cos( radians( long ) - radians(" + locationParam[1] + ") ) + sin( radians(" + locationParam[0] + ") ) * sin( radians( lat ) ) ) ) < "+distanceParam+";"
			addresses = Address.objects.raw(sqlString)
			# queryset = Address.objects.raw('SELECT id, ( 3959 * acos( cos( radians(37) ) * cos( radians( lat ) ) * cos( radians( long ) - radians(-122) ) + sin( radians(37) ) * sin( radians( lat ) ) ) ) AS distance FROM webapp_address HAVING distance < 25 ORDER BY distance;')
		if requestDate is not None:
			# locations = BusinessLocation.objects.filter(availability__date__range=(requestDate,requestDate))
			requestDateTime = dateutil.parser.parse(requestDate)
			weekday = requestDateTime.isoweekday()
			locations = BusinessLocation.objects.filter(open_hours__weekday = weekday , open_hours__from_hour__lte=requestDateTime.time, open_hours__to_hour__gte=requestDateTime.time)
		if business_type is not None and business_type != 'none':
			businesses = Business.objects.filter(business_type=business_type)
			locations = locations.filter(business__in=businesses)
			queryset = queryset.filter(business_location__in=locations)
			queryset = queryset.filter(id__in=[o.id for o in addresses])
			return list(queryset)
		else:
			queryset = queryset.filter(business_location__in=locations)
			queryset = queryset.filter(id__in=[o.id for o in addresses])
			return list(queryset)	
			# queryset.filter(business_location=business_type)
		

class business_location_list(generics.ListAPIView):
	serializer_class = BusinessLocationSerializer
	@csrf_exempt
	def get_queryset(self):
		"""
		List all furniture types.
		"""
		queryset = BusinessLocation.objects.all()

		return queryset


class business_list(generics.ListAPIView):
	serializer_class = BusinessSerializer
	@csrf_exempt
	def get_queryset(self):
		"""
		List all businesses.
		"""
		queryset = Business.objects.all()
		return queryset

# 	# def get(self, request, format=None):
# 	# 	furniture_types = FurnitureType.objects.all()
# 	# 	serializer = FurnitureTypeSerializer(furniture_types, many=True)
# 	# 	return Response(self.request.QUERY_PARAMS)


# class customizer_property_list(generics.ListAPIView):
# 	serializer_class = CustomizerPropertySerializer
# 	def get_queryset(self):
# 		"""
# 		List all customizer properties.
# 		"""
# 		queryset = CustomizerProperty.objects.all()
# 		furniture_type = self.request.QUERY_PARAMS.get('furniture_type', None)
# 		property_name = self.request.QUERY_PARAMS.get('property_name', None)
# 		if furniture_type is not None:
# 			queryset = queryset.filter(furniture_type=furniture_type)
# 		if property_name is not None:
# 			queryset = queryset.filter(property_name=property_name)
# 		return queryset

# class customizer_property_option_list(generics.ListAPIView):
# 	serializer_class = CustomizerPropertyOptionSerializer
# 	def get_queryset(self):
# 		"""
# 		List all customizer options.
# 		"""
# 		queryset = CustomizerPropertyOption.objects.all()
# 		customizer_property = self.request.QUERY_PARAMS.get('customizer_property', None)
# 		option_type = self.request.QUERY_PARAMS.get('option_type', None)
# 		if customizer_property is not None:
# 			queryset = queryset.filter(customizer_property=customizer_property)
# 		if option_type is not None:
# 			queryset = queryset.filter(option_type=option_type)
# 		return queryset
#     # elif request.method == 'POST':
#     #     data = JSONParser().parse(request)
#     #     serializer = SnippetSerializer(data=data)
#     #     if serializer.is_valid():
#     #         serializer.save()
#     #         return JSONResponse(serializer.data, status=201)
#     #     return JSONResponse(serializer.errors, status=400)

# class EmailUserList(generics.ListAPIView):
# 	queryset = EmailUser.objects.all()
# 	serializer_class = EmailUserSerializer
# 	def get_queryset(self):
# 		queryset = EmailUser.objects.all()
# 		email = self.request.QUERY_PARAMS.get('email', None)
# 		if email is not None:
# 			queryset = queryset.filter(email=email)
# 		return queryset

# class EmailUserCreate(generics.CreateAPIView):
# 	queryset = EmailUser.objects.all()
# 	serializer_class = EmailUserSerializer
# 	@csrf_exempt
# 	def get_queryset(self):
# 		queryset = EmailUser.objects.all()


# class EmailUserDetail(generics.RetrieveUpdateDestroyAPIView):
# 	queryset = EmailUser.objects.all()
# 	serializer_class = EmailUserSerializer

# class CollectionList(generics.ListAPIView):
# 	queryset = Collection.objects.all()
# 	serializer_class = CollectionSerializer
# 	def get_queryset(self):
# 		queryset = Collection.objects.all()
# 		user = self.request.QUERY_PARAMS.get('user', None)
# 		if user is not None:
# 			queryset = queryset.filter(user=user)
# 		return queryset

# class CollectionDetail(generics.RetrieveUpdateDestroyAPIView):
# 	queryset = Collection.objects.all()
# 	serializer_class = CollectionCreateSerializer


# class CollectionCreate(generics.CreateAPIView):
# 	queryset = Collection.objects.all()
# 	serializer_class = CollectionCreateSerializer
# 	@csrf_exempt
# 	def get_queryset(self):
# 		queryset = Collection.objects.all()

def index(request):
    context = {}
    return render(request, 'index.html', context)
