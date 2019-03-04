from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static
from music import views


urlpatterns = [
    # 博客首页
    url(r"^$", views.Music, name="home"),
    url(r"^mine/$", views.get_song, name="mine"),
    ]