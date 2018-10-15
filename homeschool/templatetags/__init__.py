from ..models import *
from django import template

register = template.Library()

@register.filter
def is_registered_in_classe(value):
    return type(value)