from django.shortcuts import render
from django.views.generic import DetailView, ListView
from .models import Post


class Blog(ListView):
    model = Post
    template_name = 'blog/blog.html'
    context_object_name = 'posts'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Блог'
        return context

def single_post(request):
    return render(request, 'blog/single-post.html')
