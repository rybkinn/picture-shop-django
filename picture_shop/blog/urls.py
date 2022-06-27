from django.urls import path

from .views import *

urlpatterns = [
    path('', PostBlog.as_view(), name='blog'),
    # path('post/<str:slug>/', GetPost.as_view(), name='single-post'),
]
