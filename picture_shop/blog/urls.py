from django.urls import path

from .views import *

urlpatterns = [
    path('', PostBlog.as_view(), name='blog'),
    # path('post/<str:slug>/', GetPost.as_view(), name='single-post'),
    path('get_posts/', PostBlog.show_more_posts, name='show_more_posts'),
]
