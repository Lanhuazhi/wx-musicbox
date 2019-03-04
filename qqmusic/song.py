import requests
from urllib.parse import urlencode
import json
import time
import re
import pymysql
from hashlib import md5


class GetPage():
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla / 5.0(WindowsNT10.0;Win64;x64) AppleWebKit/537.36(KHTML,likeGecko) "
                          "Chrome/73.0.3679.0Safari/537.36"
        }

        self.url_songmid = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?"

        self.url_vkey = "https://u.y.qq.com/cgi-bin/musicu.fcg?"

        self.url_lyric = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_yqq.fcg?'

        #获取歌曲页面的参数
        self.params_songmid = {
            'tpl': '3',
            'page': 'detail',
            'type': 'top',
            'song_begin': '0',
            'song_num': '30',
            'g_tk': '5381',
            'loginUin': '0',
            'hostUin': '0',
            'format': 'json',
            'inCharset': 'utf8',
            'outCharset': 'utf-8',
            'notice': '0',
            'platform': 'yqq.json',
            'needNewCode': '0',
        }

        # 获取加密参数
        self.params_vkey = {
            'g_tk': '5381',
            'loginUin': '0',
            'hostUin': '0',
            'format': 'json',
            'inCharset': 'utf8',
            'outCharset': 'utf-8',
            'notice': '0',
            'platform': 'yqq.json',
            'needNewCode': '0',
        }

        #获取歌词页面的参数
        self.params_lyric = {
            'nobase64': '1',
            'musicid': '226808103',
            '-': 'jsonp1',
            'g_tk': '5381',
            'loginUin': '0',
            'hostUin': '0',
            'format': 'json',
            'inCharset': 'utf8',
            'outCharset': 'utf-8',
            'notice': '0',
            'platform': 'yqq.json',
            'needNewCode': '0',
        }


    # 获取页面
    def get_page(self,url,params):

        url = url + urlencode(params)

        try:
            responses = requests.get(url,headers=self.headers)
            if responses.status_code == 200:
                return responses.json()
        except requests.ConnectionError:
            return None


class Spider():
    #爬取歌曲页面数据解析
    def parse_songmid_songList(self,json):
        songmid_list = []
        if json:
            for item in json.get("songlist"):
                songmid_dict = { }
                songmid_dict["songmid"] = item.get("data").get("songmid")
                songmid_dict["songid"] = item.get("data").get("songid")
                songmid_dict["songname"] = item.get("data").get("songname")
                songmid_dict["singer"] = item.get("data").get("singer")[0].get("name")
                songmid_dict["albummid"] = item.get("data").get("albummid")
                songmid_list.append(songmid_dict)
        return songmid_list

    def parse_vkey_list(self,json2):
        if json2:
            purl =  json2.get("req_0").get("data").get("midurlinfo")[0].get("purl")
            return purl

    #爬取歌词页面数据解析
    def parse_lyric(self,json3):
        lyrics = []
        if json3:
            lyric = json3.get("lyric")
            lyric_list = lyric.split("&#13;&#10;")
            for item in lyric_list:
                # 切割多个分割符
                lyric_lists = re.split("&#58;|&#46;", item)
                lyriced = ":".join(lyric_lists)
                lyrics.append(lyriced)
        result = "&#13;&#10;".join(lyrics)
        return result



    # 歌曲的储存
    def save(self,topid,tag,content,songmid_list):
        if songmid_list:
            song_detail = songmid_list
            content.append({'topid': topid,'tag_name':tag, 'detail': song_detail})


def get_song(content,topid="27",date="2019-02-21",tag="新歌榜"):
    get_page = GetPage()
    get_page.params_songmid["topid"] = topid
    get_page.params_songmid["date"] = date
    json = get_page.get_page(get_page.url_songmid,get_page.params_songmid)
    songmid_list = Spider().parse_songmid_songList(json)
    for item in songmid_list:
        songmid = item["songmid"]
        albummid = item["albummid"]
        print(albummid)
        get_page.params_vkey["data"] = '{"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey",' \
                                       '"param":{"guid":"4900301790",' \
                                       '"songmid":'+'["'+songmid+'"]'+',' +\
                                       '"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},' \
                                       '"comm":{"uin":0,"format":"json","ct":24,"cv":0}}'
        # 爬取歌曲
        json2 = get_page.get_page(get_page.url_vkey ,get_page.params_vkey)
        purl = Spider().parse_vkey_list(json2)
        item["url"] = "http://183.232.63.148/amobile.music.tc.qq.com/"+ purl
        #爬取歌词
        referer = "https://y.qq.com/n/yqq/song/"+songmid+".html"
        get_page.headers["referer"] = referer
        get_page.params_lyric["musicid"] = item["songid"]
        json3 = get_page.get_page(get_page.url_lyric,get_page.params_lyric)
        lyric = Spider().parse_lyric(json3)
        item["lyric"] = lyric
        #爬取歌曲图片
        item["image_url"] = "https://y.gtimg.cn/music/photo_new/T002R300x300M000"+albummid+".jpg?max_age=2592000"
    Spider().save(topid,tag,content,songmid_list)





if __name__ == "__main__":
    content =[]
    today = time.strftime("%Y-%m-%d")
    list = [{"topid":'27',"song_tag":"新歌榜","date":today},
            {"topid":'26',"song_tag":"热歌榜","date":"2019_07"},
            {"topid":'4',"song_tag":"飙升榜","date":today},
            {"topid":'52',"song_tag":"原创榜","date":"2019_07"}]
    for foo in list:
        print(foo)
        get_song(content,topid=foo["topid"],date=foo["date"],tag=foo["song_tag"])
        time.sleep(10)

    # 存json 文件
    with open('song.json', 'w') as f:
        json.dump(content, f,indent = 4) # 格式化显示 indent = 4
