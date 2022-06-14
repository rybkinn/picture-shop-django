from django import template

register = template.Library()


@register.inclusion_tag('blog/widgets/search.html')
def get_search():
    pass


@register.inclusion_tag('blog/widgets/archive.html')
def get_archive():
    pass


@register.inclusion_tag('blog/widgets/gallery.html')
def get_gallery():
    pass


# @register.inclusion_tag('blog/popular_posts_tpl.html')
# def get_popular(cnt=3):
#     posts = Post.objects.order_by('-views')[:cnt]
#     return {'posts': posts}
