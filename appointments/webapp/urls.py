from django.conf.urls import patterns, url, include
from rest_framework.urlpatterns import format_suffix_patterns

from webapp import views
from django.contrib import admin
from rest_framework import routers
from rest_framework.decorators import api_view
admin.autodiscover()

# routers = routers.DefaultRouter(trailing_slash=False)
# routers.register(r'api/users/create/', views.EmailUserCreateViewset)

# @api_view(('GET',))
# def api_root(request, format=None):
#     return Response({
#         'users': reverse('user-list', request=request, format=format),
#         'snippets': reverse('snippet-list', request=request, format=format)
#     })

urlpatterns = patterns(
    '',
    url(r'^type/$', views.type_list.as_view()),
    url(r'^address/$', views.address_list.as_view()),
    url(r'^business/$', views.business_list.as_view()),
    url(r'^business/location$', views.business_location_list.as_view()),
)

# urlpatterns = format_suffix_patterns(urlpatterns)