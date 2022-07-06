from django.urls import path, re_path

from blog.views import PostBlog
from .views import *

urlpatterns = [
    path('', PostHome.as_view(), name='home'),
    path('about-me/', about_me, name='about-me'),
    path('contacts/', contacts, name='contacts'),
    path('services/', services, name='services'),
    path('services/portrait/', portrait, name='portrait'),
    path('services/street-artist-services/', street_artist_services, name='street-artist-services'),
    path('terms-of-use/', terms_of_use, name='terms-of-use'),
    re_path(r'^(.*)?/show_more_posts/$', PostBlog.show_more_posts, name='show_more_posts'),
]
