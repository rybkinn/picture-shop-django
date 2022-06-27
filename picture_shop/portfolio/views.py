from django.views.generic import ListView

from django.shortcuts import render

from users.models import CustomUser
from blog.models import Post


class PostHome(ListView):
    model = Post
    template_name = 'portfolio/index.html'
    context_object_name = 'posts'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Главная'
        context['users'] = CustomUser.objects.all()
        return context

    def get_queryset(self):
        post_count = 4
        return Post.objects.all().order_by('-pk')[:post_count]


def about_me(request):
    return render(request, 'portfolio/about-me.html')


def contacts(request):
    return render(request, 'portfolio/contacts.html')


def services(request):
    return render(request, 'portfolio/services.html')


def portrait(request):
    return render(request, 'portfolio/portrait.html')


def street_artist_services(request):
    return render(request, 'portfolio/street-artist-services.html')


def terms_of_use(request):
    return render(request, 'portfolio/terms-of-use.html')
