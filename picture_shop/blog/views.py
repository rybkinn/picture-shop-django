from django.conf import settings
from django.db.models import QuerySet
from django.http import JsonResponse, Http404, HttpResponseBadRequest, QueryDict
from django.utils import dateformat
from django.views.generic import DetailView, ListView, View

from users.models import CustomUser
from .models import Post
from .utils import PostSettings, ValidatePostData


class BlogPost(PostSettings, ListView):
    model = Post
    template_name = 'blog/blog.html'
    context_object_name = 'posts'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Блог'
        context['users'] = CustomUser.objects.all()
        context['start_posts_number'] = self.start_posts_number
        return context

    def get_queryset(self):
        return Post.objects.filter(is_archived=False).order_by('-creation_time')[:self.start_posts_number]


class SearchPost(PostSettings, ListView):
    template_name = 'blog/blog.html'
    context_object_name = 'posts'

    def get_queryset(self):
        return Post.objects.filter(title__icontains=self.request.GET.get('s'),
                                   is_archived=False)[:self.start_posts_number]

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['s'] = f"s={self.request.GET.get('s')}&"
        context['start_posts_number'] = self.start_posts_number
        return context


class AjaxShowMorePosts(ValidatePostData, PostSettings, View):
    def __query_database(self, page: str, get_param: QueryDict) -> tuple[int, QuerySet]:
        """
        Depending on the page makes a request to the database.
        :param page: page relatively /blog/
        :param get_param: incoming GET parameters.
        :return: how many posts are left in the database, posts to send.
        """
        if page == '' or page == 'search/':
            count_posts_displayed = int(get_param.get('count_posts'))
            posts_left = Post.objects.filter(is_archived=False).count() - count_posts_displayed
            sent_posts = Post.objects.filter(is_archived=False).order_by('-creation_time')[
                         count_posts_displayed:count_posts_displayed + self.count_posts_add]
        elif page == 'archive/':
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
        else:
            raise ValueError(page)

        return posts_left, sent_posts

    def get(self, request, *args, **kwargs) -> Http404 | HttpResponseBadRequest | JsonResponse:
        """
        Handling AJAX request on display new posts.
        """
        posts_left, sent_posts = self.__query_database(args[0], request.GET)

        json_data = list(sent_posts.values())
        for content in json_data:
            content['author'] = CustomUser.objects.get(id=content['author_id']).username
            content['author_avatar'] = '/media/' + str(CustomUser.objects.get(id=content['author_id']).avatar)
            content['background_image'] = '/media/' + content['background_image']
            content['description'] = ' '.join(str(content['description']).split(' ')[:20]) + ' …'
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


class ArchivePost(PostSettings, ListView):
    template_name = 'blog/blog.html'
    context_object_name = 'posts'

    def get_queryset(self):
        get_month = self.request.GET.get('month')
        get_year = self.request.GET.get('year')

        return Post.objects.filter(
                    is_archived=True,
                    creation_time__year=get_year,
                    creation_time__month=get_month
                )[:self.start_posts_number]

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['start_posts_number'] = self.start_posts_number
        return context


class SinglePost(DetailView):
    model = Post
    context_object_name = 'post'
    template_name = 'blog/single-post.html'
