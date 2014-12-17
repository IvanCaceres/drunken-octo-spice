from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'appointments.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', 'webapp.views.index', name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'', include('webapp.urls')),
    url(r'^.*/$', 'webapp.views.index', name='index'),
)

from django.conf import settings

if settings.DEBUG:
    urlpatterns += patterns('django.contrib.staticfiles.views',
        url(r'^static/(?P<path>.*)$', 'serve'),
    )
