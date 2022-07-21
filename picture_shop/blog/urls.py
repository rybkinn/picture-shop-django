from django.urls import path, re_path

from .views import *

urlpatterns = [
    path('', BlogPost.as_view(), name='blog'),
    path('post/<slug:slug>/', SinglePost.as_view(), name='single-post'),
    path('search/', SearchPost.as_view(), name='search'),
    path('archive/', ArchivePost.as_view(), name='archive'),
    re_path(r'^(.*)?show_more_posts/$', AjaxShowMorePosts.as_view(), name='show-more-posts'),
]
