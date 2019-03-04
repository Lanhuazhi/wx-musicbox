from django.contrib import admin
from music import models

# Register your models here.
admin.site.register(models.Tag)
admin.site.register(models.Song)