from pprint import pprint

from datetime import datetime, timezone
from django.http import JsonResponse
from django.views.generic import DetailView, ListView

from users.models import CustomUser
from .models import Post, Category


class PostBlog(ListView):
    model = Post
    template_name = 'blog/blog.html'
    context_object_name = 'posts'

    start_posts_number = 4
    posts_left = Post.objects.count() - start_posts_number
    current_number_posts = start_posts_number

    count_posts_add = 2

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Блог'
        context['users'] = CustomUser.objects.all()
        context['posts_left'] = self.posts_left
        return context

    def get_queryset(self):
        return Post.objects.all().order_by('-pk')[:self.start_posts_number]

    @staticmethod
    def show_more_posts(request):
        current_posts = Post.objects.all().order_by('-pk')[
                        PostBlog.current_number_posts:PostBlog.current_number_posts+PostBlog.count_posts_add]

        PostBlog.current_number_posts += PostBlog.count_posts_add
        PostBlog.posts_left -= PostBlog.count_posts_add
        a = Post.objects.get(id=24).post_time
        pprint(a.replace(tzinfo=timezone.utc))
        json_data = list(current_posts.values())
        for content in json_data:
            content['author'] = CustomUser.objects.get(id=content['author_id']).username
            content['author_avatar'] = '/media/' + str(CustomUser.objects.get(id=content['author_id']).avatar)
            content['background_image'] = '/media/' + content['background_image']
            # content['post_time'] = Post.objects.get(id=content['id']).post_time.tzinfo
            del content['author_id']
            del content['category_id']

        json_data.insert(0, {'total_posts_count': PostBlog.posts_left})

        return JsonResponse(json_data, safe=False)


class GetSinglePost(DetailView):
    model = Post
    context_object_name = 'post'
    template_name = 'blog/single-post.html'
