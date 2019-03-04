from django.db import models

# Create your models here.


class Tag(models.Model):
    name = models.CharField(max_length=10)
    topid = models.CharField(max_length=5)


class Song(models.Model):
    songname = models.CharField(max_length=20)
    singer = models.CharField(max_length=20)
    imagerurl = models.CharField(max_length=200)
    songurl = models.CharField(max_length=250)
    songmid = models.CharField(max_length=20)
    lyric = models.TextField()
    tagName = models.ForeignKey(Tag,on_delete=models.CASCADE,default="",verbose_name="分类")
