from django.urls import path

from .views import *

urlpatterns = [
    path('', MainPage.as_view(), name='home'),
    path('about-me/', AboutMe.as_view(), name='about-me'),
    path('contacts/', contacts, name='contacts'),
    path('services/', services, name='services'),
    path('services/portrait/', portrait, name='portrait'),
    path('services/street-artist-services/', street_artist_services, name='street-artist-services'),
    path('terms-of-use/', terms_of_use, name='terms-of-use'),
]
