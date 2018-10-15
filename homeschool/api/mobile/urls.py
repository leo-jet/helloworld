from django.conf.urls import url
from .views import *
urlpatterns = [
    url(r'^cours/$', get_cours_list, name='cours'),

]