from django.urls import path, re_path

from .views import *

urlpatterns = [
    path('', BlogPost.as_view(), name='blog'),
    path('show_more_posts/', AjaxShowMorePosts.as_view(), {'ajax_page': 'blog_main_page'}),
    path('post/<slug:slug>/', SinglePost.as_view(), name='single-post'),
    path('search/', SearchPost.as_view(), name='search'),
    path('search/show_more_posts/', AjaxShowMorePosts.as_view(), {'ajax_page': 'blog_search_page'}),
    path('archive/', ArchivePost.as_view(), name='archive'),
    path('archive/show_more_posts/', AjaxShowMorePosts.as_view(), {'ajax_page': 'blog_archive_page'}),
    path('category/<slug:slug>/', CategoryPost.as_view(), name='category'),
    path('category/<slug:slug>/show_more_posts/', AjaxShowMorePosts.as_view(), {'ajax_page': 'category_page'}),
]
