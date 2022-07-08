from django.conf import settings
from django.http import JsonResponse, Http404, HttpResponseBadRequest
from django.utils import dateformat
from django.views.generic import DetailView, ListView, View

from users.models import CustomUser
from .models import Post
from .utils import PostSettings, ValidatePostData


class PostBlog(PostSettings, ListView):
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
        return Post.objects.all().order_by('-pk')[:self.start_posts_number]


class SearchPost(PostSettings, ListView):
    template_name = 'blog/blog.html'
    context_object_name = 'posts'

    def dispatch(self, request, *args, **kwargs):
        print(request.get_full_path().split('/'))
        print(request.get_full_path())
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Post.objects.filter(title__icontains=self.request.GET.get('s'))[:self.start_posts_number]

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['s'] = f"s={self.request.GET.get('s')}&"
        context['start_posts_number'] = self.start_posts_number
        return context


class ShowMorePosts(ValidatePostData, PostSettings, View):
    def get(self, request, *args, **kwargs) -> Http404 | HttpResponseBadRequest | JsonResponse:
        """
        Handling AJAX request on display new posts.
        """
        if issubclass(ShowMorePosts, ValidatePostData):
            validate_data = self.validate_request(request)
            if not validate_data['success']:
                if validate_data['status'] == 404:
                    raise Http404(validate_data['message'])
                elif validate_data['status'] == 400:
                    return HttpResponseBadRequest(validate_data['message'], validate_data['status'])
            count_posts_displayed = validate_data['result']
        else:
            count_posts_displayed = int(request.GET.get('count_posts'))

        posts_left = Post.objects.count() - count_posts_displayed
        sent_posts = Post.objects.all().order_by('-pk')[
                     count_posts_displayed:count_posts_displayed + self.count_posts_add]

        json_data = list(sent_posts.values())
        for content in json_data:
            content['author'] = CustomUser.objects.get(id=content['author_id']).username
            content['author_avatar'] = '/media/' + str(CustomUser.objects.get(id=content['author_id']).avatar)
            content['background_image'] = '/media/' + content['background_image']
            content['description'] = ' '.join(str(content['description']).split(' ')[:20]) + ' …'
            content['post_time'] = dateformat.format(
                Post.objects.get(id=content['id']).post_time, settings.DATE_FORMAT + ' г. H:i')

            delete_keys = ('id', 'author_id', 'category_id')
            for key in delete_keys:
                content.pop(key, None)

        json_data.insert(0, {
            'posts_left': posts_left,
            'count_posts_add': self.count_posts_add
        })

        return JsonResponse(json_data, safe=False)


class GetSinglePost(DetailView):
    model = Post
    context_object_name = 'post'
    template_name = 'blog/single-post.html'
