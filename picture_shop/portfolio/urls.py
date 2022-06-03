from django.urls import path

from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('about-me/', about_me, name='about-me'),
    path('contacts/', contacts, name='contacts'),
    path('services/', services, name='services'),
    path('portrait/', portrait, name='portrait'),
    path('street-artist-services/', street_artist_services, name='street-artist-services'),
]
