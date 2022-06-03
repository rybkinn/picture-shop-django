from django.shortcuts import render


# Create your views here.
def home(request):
    return render(request, 'portfolio/index.html')


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
