from django.urls import path

from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('about-me/', about_me, name='about-me'),
    path('contacts/', contacts, name='contacts'),
]
