import re

from django.conf import settings
from django.db.models import QuerySet
from django.http import JsonResponse, Http404, HttpResponseBadRequest, QueryDict
from django.utils import dateformat
from django.views.generic import DetailView, ListView, View

from users.models import CustomUser
from .models import Post
from .utils import PostSettings


class BaseBlog(PostSettings, ListView):
    model = Post
    template_name = 'blog/blog.html'
    context_object_name = 'posts'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Блог'
        context['start_posts_number'] = self.start_posts_number
        context['users'] = CustomUser.objects.all()
        return context


class BlogPost(BaseBlog):
    def get_queryset(self):
        return Post.objects.filter(is_archived=False).order_by('-creation_time')[:self.start_posts_number]


class SearchPost(BaseBlog):
    def get_queryset(self):
        return Post.objects.filter(title__icontains=self.request.GET.get('s'),
                                   is_archived=False)[:self.start_posts_number]

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['s'] = f"s={self.request.GET.get('s')}&"
        return context


class SearchAuthorPost(BaseBlog):
    def get_queryset(self):
        return Post.objects.filter(author__username=self.request.GET.get('author'),
                                   is_archived=False)[:self.start_posts_number]

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['author'] = f"author={self.request.GET.get('author')}&"
        return context


class AjaxShowMorePosts(PostSettings, View):

    def get(self, request, *args, **kwargs) -> Http404 | HttpResponseBadRequest | JsonResponse:
        """
        Handling AJAX request on display new posts.
        """
        match kwargs['ajax_page']:
            case 'blog_main_page':
                posts_left, sent_posts = self.__get_posts_blog_main_page(request.GET)
            case 'blog_search_page':
                posts_left, sent_posts = self.__get_posts_blog_search_page(request.GET)
            case 'blog_archive_page':
                posts_left, sent_posts = self.__get_posts_blog_archive_page(request.GET)
            case 'category_page':
                posts_left, sent_posts = self.__get_posts_category_page(request.GET)
            case 'search_author_page':
                posts_left, sent_posts = self.__get_posts_search_author_page(request.GET)
            case 'tag_page':
                posts_left, sent_posts = self.__get_posts_tag_page(request.GET)
            case _:
                raise ValueError(kwargs['ajax_page'])

        json_data = list(sent_posts.values())
        for content in json_data:
            content['author'] = CustomUser.objects.get(id=content['author_id']).username
            content['author_avatar'] = str(CustomUser.objects.get(id=content['author_id']).avatar)
            content['background_image'] = content['background_image']
            content['description'] = ' '.join(
                re.sub(r'\<[^>]*\>', '', str(content['description'])).split(' ')[:20]) + ' …'
            content['creation_time'] = dateformat.format(
                Post.objects.get(id=content['id']).creation_time, settings.DATE_FORMAT + ' г. H:i')

            delete_keys = ('id', 'author_id', 'category_id')
            for key in delete_keys:
                content.pop(key, None)

        json_data.insert(0, {
            'posts_left': posts_left,
            'count_posts_add': self.count_posts_add
        })

        return JsonResponse(json_data, safe=False)

    def __get_posts_blog_main_page(self, get_param: QueryDict) -> tuple[int, QuerySet]:
        """
        Requesting more posts for a blog page from the database.
        :param get_param: incoming GET parameters.
        :return: how many posts are left in the database, posts to send.
        """
        count_posts_displayed = int(get_param.get('count_posts'))
        posts_left = Post.objects.filter(is_archived=False).count() - count_posts_displayed
        sent_posts = Post.objects.filter(is_archived=False).order_by('-creation_time')[
                     count_posts_displayed:count_posts_displayed + self.count_posts_add]
        return posts_left, sent_posts

    def __get_posts_blog_search_page(self, get_param: QueryDict) -> tuple[int, QuerySet]:
        """
        Requesting more posts for the blog search page from the database.
        :param get_param: incoming GET parameters.
        :return: how many posts are left in the database, posts to send.
        """
        count_posts_displayed = int(get_param.get('count_posts'))
        search_request = str(get_param.get('search_request'))
        posts_left = Post.objects \
                         .filter(title__icontains=search_request, is_archived=False).count() - count_posts_displayed
        sent_posts = Post.objects \
                         .filter(title__icontains=search_request, is_archived=False) \
                         .order_by('-creation_time')[count_posts_displayed:count_posts_displayed + self.count_posts_add]
        return posts_left, sent_posts

    def __get_posts_blog_archive_page(self, get_param: QueryDict) -> tuple[int, QuerySet]:
        """
        Requesting more posts for the blog archives page from the database.
        :param get_param: incoming GET parameters.
        :return: how many posts are left in the database, posts to send.
        """
        count_posts_displayed = int(get_param.get('count_posts'))
        get_month = get_param.get('month')
        get_year = get_param.get('year')
        posts_left = Post.objects.filter(
            is_archived=True,
            creation_time__year=get_year,
            creation_time__month=get_month
        ).count() - count_posts_displayed
        sent_posts = Post.objects.filter(
            is_archived=True,
            creation_time__year=get_year,
            creation_time__month=get_month
        ).order_by('-creation_time')[count_posts_displayed:count_posts_displayed + self.count_posts_add]
        return posts_left, sent_posts

    def __get_posts_category_page(self, get_param: QueryDict) -> tuple[int, QuerySet]:
        """
        Requesting more posts for the blog category page from the database.
        :param get_param: incoming GET parameters.
        :return: how many posts are left in the database, posts to send.
        """
        count_posts_displayed = int(get_param.get('count_posts'))
        posts_left = Post.objects.filter(
            category__slug=self.kwargs['slug'], is_archived=False).count() - count_posts_displayed
        sent_posts = Post.objects.filter(
            category__slug=self.kwargs['slug'], is_archived=False).order_by('-creation_time')[
                     count_posts_displayed:count_posts_displayed + self.count_posts_add]
        return posts_left, sent_posts

    def __get_posts_search_author_page(self, get_param: QueryDict) -> tuple[int, QuerySet]:
        """
        Requesting more posts for the blog author page from the database.
        :param get_param: incoming GET parameters.
        :return: how many posts are left in the database, posts to send.
        """
        count_posts_displayed = int(get_param.get('count_posts'))
        posts_left = Post.objects.filter(
            author__username=self.request.GET.get('author'),
            is_archived=False).count() - count_posts_displayed
        sent_posts = Post.objects.filter(
            author__username=self.request.GET.get('author'),
            is_archived=False).order_by('-creation_time')[
                     count_posts_displayed:count_posts_displayed + self.count_posts_add]
        return posts_left, sent_posts

    def __get_posts_tag_page(self, get_param: QueryDict) -> tuple[int, QuerySet]:
        """
        Requesting more posts for the blog tag page from the database.
        :param get_param: incoming GET parameters.
        :return: how many posts are left in the database, posts to send.
        """
        count_posts_displayed = int(get_param.get('count_posts'))
        posts_left = Post.objects.filter(
            tag__slug=self.kwargs['slug'], is_archived=False).count() - count_posts_displayed
        sent_posts = Post.objects.filter(
            tag__slug=self.kwargs['slug'], is_archived=False).order_by('-creation_time')[
                     count_posts_displayed:count_posts_displayed + self.count_posts_add]
        return posts_left, sent_posts


class ArchivePost(BaseBlog):
    def get_queryset(self):
        get_month = self.request.GET.get('month')
        get_year = self.request.GET.get('year')

        return Post.objects.filter(
                    is_archived=True,
                    creation_time__year=get_year,
                    creation_time__month=get_month
                )[:self.start_posts_number]


class SinglePost(DetailView):
    model = Post
    context_object_name = 'post'
    template_name = 'blog/single-post.html'


class CategoryPost(BaseBlog):
    def get_queryset(self):
        return Post.objects.filter(
            category__slug=self.kwargs['slug'],
            is_archived=False
        ).order_by('-creation_time')[:self.start_posts_number]

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category_slug'] = self.kwargs['slug']
        return context


class PostByTag(BaseBlog):
    def get_queryset(self):
        return Post.objects.filter(
            tag__slug=self.kwargs['slug'],
            is_archived=False
        ).order_by('-creation_time')[:self.start_posts_number]

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['tag_slug'] = self.kwargs['slug']
        return context
