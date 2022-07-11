from django import template
from django.utils import dateformat

from blog.models import Post

register = template.Library()


@register.inclusion_tag('blog/widgets/search.html')
def get_search():
    pass


@register.inclusion_tag('blog/widgets/archive.html')
def get_archive():
    archived_posts = Post.objects.filter(is_archived=True).order_by('creation_time')
    dates_archive_list = [dateformat.format(post.creation_time, "F Y") for post in archived_posts]

    dates_archive_list[:] = list(dict.fromkeys(dates_archive_list))

    return {'dates_archive_list': dates_archive_list}


@register.inclusion_tag('blog/widgets/gallery.html')
def get_gallery():
    pass
