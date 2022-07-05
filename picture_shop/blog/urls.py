from django.urls import path, re_path

from .views import *

urlpatterns = [
    path('', PostBlog.as_view(), name='blog'),
    # path('post/<str:slug>/', GetPost.as_view(), name='single-post'),
    re_path(r'^show_more_posts/', PostBlog.show_more_posts, name='show_more_posts'),
    path('search/', SearchPost.as_view(), name='search'),
]
