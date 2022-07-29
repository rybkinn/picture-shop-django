from django.shortcuts import render


def page_not_found_view(request, exception, template_name='404.html'):
    return render(request, template_name, status=404)


def page_internal_server_error(request, exception, template_name='500.html'):
    return render(request, template_name, status=500)
