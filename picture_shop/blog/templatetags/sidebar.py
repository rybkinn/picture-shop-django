import datetime

from django import template
from django.utils import dateformat

from blog.models import Post

register = template.Library()


@register.inclusion_tag('blog/widgets/search.html')
def get_search():
    pass


@register.inclusion_tag('blog/widgets/archive.html')
def get_archive(number_previous_year: int = 1) -> dict:
    """
    Creates a list of archived post grouped by month and year.
    :param number_previous_year: indicate how many years ago from the current.
    :return: list of archived post dates('month year').
    """
    archived_posts = Post.objects.filter(is_archived=True).order_by('-creation_time')
    dates_archive_list = [dateformat.format(post.creation_time, "F Y") for post in archived_posts]

    dates_archive_list[:] = list(dict.fromkeys(dates_archive_list))

    year_now = datetime.datetime.now().year
    date_archive_list_year_filtered = list()

    for date_archive in dates_archive_list:
        date_archive_year = int(date_archive.split(' ')[1])
        if year_now - number_previous_year <= date_archive_year <= year_now:
            date_archive_list_year_filtered.append(date_archive)

    return {
        'date_archive_list_year_filtered': date_archive_list_year_filtered,
        'date_archive_list_year_slug': []
    }


@register.inclusion_tag('blog/widgets/gallery.html')
def get_gallery():
    pass
