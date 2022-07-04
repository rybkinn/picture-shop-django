from django.conf import settings
from django.http import JsonResponse
from django.utils import dateformat
from django.views.generic import DetailView, ListView

from users.models import CustomUser
from .models import Post


class PostBlog(ListView):
    model = Post
    template_name = 'blog/blog.html'
    context_object_name = 'posts'

    start_posts_number = 4
    count_posts_add = 2

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Блог'
        context['users'] = CustomUser.objects.all()
        return context

    def get_queryset(self):
        return Post.objects.all().order_by('-pk')[:self.start_posts_number]

    @staticmethod
    def show_more_posts(request) -> JsonResponse:
        """
        Handling AJAX request on display new posts in Blog page.
        """
        count_posts_displayed = int(request.GET.get('count_posts', default=0))
        posts_left = Post.objects.count() - count_posts_displayed
        sent_posts = Post.objects.all().order_by('-pk')[
                     count_posts_displayed:count_posts_displayed + PostBlog.count_posts_add]

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
            'count_posts_add': PostBlog.count_posts_add
        })

        return JsonResponse(json_data, safe=False)


class GetSinglePost(DetailView):
    model = Post
    context_object_name = 'post'
    template_name = 'blog/single-post.html'
