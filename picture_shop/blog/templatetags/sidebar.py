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
