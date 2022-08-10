from django import template

from portfolio.models import Tag


register = template.Library()


@register.inclusion_tag('inc/_footer.html')
def get_footer():
    tags = Tag.objects.all().order_by('-id')[:6]
    return {'tags': tags}
