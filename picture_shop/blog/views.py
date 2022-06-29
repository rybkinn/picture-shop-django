from django.http import JsonResponse
from django.views.generic import DetailView, ListView

from users.models import CustomUser
from .models import Post


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

        json_data = list(current_posts.values())
        json_data.insert(0, {'total_posts_count': PostBlog.posts_left})
        return JsonResponse(json_data, safe=False)


class GetSinglePost(DetailView):
    model = Post
    context_object_name = 'post'
    template_name = 'blog/single-post.html'
