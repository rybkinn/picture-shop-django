from django.shortcuts import render


def blog(request):
    return render(request, 'blog/blog.html')


def single_post(request):
    return render(request, 'blog/single-post.html')
