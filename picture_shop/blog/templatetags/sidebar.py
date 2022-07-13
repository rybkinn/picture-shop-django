import datetime

from dateutil import relativedelta
from django import template
from django.db.models import Count
from django.db.models.functions import TruncMonth, TruncYear
from django.utils.timezone import utc

from blog.models import Post


register = template.Library()


@register.inclusion_tag('blog/widgets/search.html')
def get_search():
    pass


@register.inclusion_tag('blog/widgets/archive.html')
def get_archive(previous_years: int = 1):
    """
    Returns a block with archives for the specified number of years from the current date.
    :param previous_years: Specify how many last years of archives to output.
    """
    start_date = datetime.datetime.now(tz=utc) - relativedelta.relativedelta(years=previous_years)
    end_date = datetime.datetime.now(tz=utc)

    archived_posts = Post.objects\
        .filter(is_archived=True, creation_time__range=[start_date, end_date])\
        .annotate(month=TruncMonth('creation_time'))\
        .annotate(year=TruncYear('creation_time'))\
        .values('month')\
        .annotate(c=Count('id')).order_by('-month', '-year')

    return {
        'archived_posts': archived_posts
    }


@register.inclusion_tag('blog/widgets/gallery.html')
def get_gallery():
    pass
