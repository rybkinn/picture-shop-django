import datetime

from dateutil import relativedelta
from django import template
from django.db.models import Count
from django.db.models.functions import TruncMonth, TruncYear
from django.utils.timezone import utc

from blog.models import Post, Gallery, Category
from portfolio.models import Tag


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
    gallery_items = Gallery.objects.all()
    return {'gallery_items': gallery_items}


@register.inclusion_tag('blog/widgets/category.html')
def get_category():
    category_items = Category.objects.all()
    return {'category_items': category_items}


@register.inclusion_tag('blog/widgets/latest_posts.html')
def get_latest_posts():
    latest_posts = Post.objects.filter(is_archived=False).order_by('-creation_time')[:3]
    return {'latest_posts': latest_posts}


@register.inclusion_tag('blog/widgets/about_me.html')
def get_about_me():
    pass


@register.inclusion_tag('blog/widgets/tag.html')
def get_tag():
    tag_items = Tag.objects.all()
    return {'tag_items': tag_items}
