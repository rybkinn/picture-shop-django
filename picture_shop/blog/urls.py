from django.urls import path

from .views import *

urlpatterns = [
    path('', blog, name='blog'),
    path('single-post/', single_post, name='single-post'),
]
