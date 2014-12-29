from django.conf.urls import patterns, url, include
from rest_framework.urlpatterns import format_suffix_patterns

from webapp import views
from django.contrib import admin
from rest_framework import routers
from rest_framework.decorators import api_view
admin.autodiscover()

router = routers.DefaultRouter()
router.register(r'users', views.UserView, 'users')
router.register(r'appointments', views.AppointmentViewSet, 'detail')
router.register(r'availability', views.AvailabilityViewSet, 'availability')
router.register(r'car/makes', views.CarMakeViewSet, 'car makes')
router.register(r'car/years', views.YearViewSet, 'car years')
router.register(r'car/models', views.CarModelViewSet, 'car models')
router.register(r'car/users', views.UserCarViewSet, 'user car')
router.register(r'car/userlist', views.UserCarListViewSet, 'user cars list')
# routers.register(r'api/users/create/', views.EmailUserCreateViewset)

# @api_view(('GET',))
# def api_root(request, format=None):
#     return Response({
#         'users': reverse('user-list', request=request, format=format),
#         'snippets': reverse('snippet-list', request=request, format=format)
#     })

urlpatterns = patterns(
    '',
    url(r'^api/', include(router.urls)),
    url(r'^api/type/$', views.type_list.as_view()),
    url(r'^api/address/$', views.address_list.as_view()),
    url(r'^api/business/$', views.business_list.as_view()),
    url(r'^api/business/location$', views.business_location_list.as_view()),
    url(r'^api/auth/$', views.AuthView.as_view(),name='authenticate'),
)

# urlpatterns = format_suffix_patterns(urlpatterns)