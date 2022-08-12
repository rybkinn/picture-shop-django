from django.views.generic import ListView, TemplateView

from django.shortcuts import render

from users.models import CustomUser
from blog.models import Post
from .models import MyWork, MyClient


class MainPage(ListView):
    model = Post
    template_name = 'portfolio/index.html'
    context_object_name = 'posts'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Главная'
        context['users'] = CustomUser.objects.all()
        my_works = MyWork.objects.filter(is_published=True).order_by('creation_time')
        context['my_works_1'] = my_works[::3]
        context['my_works_2'] = my_works[1::3]
        context['my_works_3'] = my_works[2::3]
        return context

    def get_queryset(self):
        post_count = 4
        return Post.objects.all().order_by('-pk')[:post_count]


class AboutMe(TemplateView):
    template_name = 'portfolio/about-me.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['my_clients'] = MyClient.objects.all().order_by('created_at')
        return context


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
