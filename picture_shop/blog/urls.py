from django.urls import path, re_path

from .views import *

urlpatterns = [
    path('', BlogPost.as_view(), name='blog'),
    # path('post/<str:slug>/', GetPost.as_view(), name='single-post'),
    path('search/', SearchPost.as_view(), name='search'),
    re_path(r'^(.*)?show_more_posts/$', ShowMorePosts.as_view(), name='show-more-posts'),
]
