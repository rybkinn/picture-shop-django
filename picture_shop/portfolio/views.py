from django.shortcuts import render


# Create your views here.
def home(request):
    return render(request, 'portfolio/index.html')


def about_me(request):
    return render(request, 'portfolio/about-me.html')


def contacts(request):
    return render(request, 'portfolio/contacts.html')
