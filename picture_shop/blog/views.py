from django.views.generic import DetailView, ListView

from users.models import CustomUser
from .models import Post


class PostBlog(ListView):
    model = Post
    template_name = 'blog/blog.html'
    context_object_name = 'posts'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Блог'
        context['users'] = CustomUser.objects.all()
        return context

    def get_queryset(self):
        post_per_page = 4
        return Post.objects.all().order_by('-pk')[:post_per_page]


class GetSinglePost(DetailView):
    model = Post
    context_object_name = 'post'
    template_name = 'blog/single-post.html'
