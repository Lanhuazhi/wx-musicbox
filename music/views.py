from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
import json
from qqmusic.song import GetPage,Spider

# Create your views here.


def Music(request):

    return render(request,'music.html')


def get_song(request):
    song_status = True
    if song_status:
        with open("qqmusic/song.json",'r') as f:
            song_list = json.load(f)
        return JsonResponse({"data":song_list})
