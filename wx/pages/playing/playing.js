// pages/index/home.js
const innerAudioContext = wx.createInnerAudioContext();

//音频的数据链接，用于直接播放。支持云文件ID（2.2.3起）。
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singer:"qq音乐欢迎您使用",
    url:'',
    imageurl:'',
    lyric:'',
    lyricShow:"",
    name:"on",
    scHeight:200,
    top:0,
    clientHeight:'',
    haveLyric:true,
    currentColor:"black",
    currentFontSize:"33rpx",
    currentIndex:0,
    a:0,
    cur:"",
    duration:"--:--"
  },


  onplay: function () {
    if(this.data.isplay){
      var that = this;
      innerAudioContext.src = that.data.url;
      innerAudioContext.play();
      that.setData({
        playicon: '/images/icons/stop.png',
        name:"stop",
        isplay:false,
      })
     

      //音乐进度条
    innerAudioContext.onTimeUpdate(function (){
      var duration = innerAudioContext.duration;
      var cur = innerAudioContext.currentTime;
      if (that.data.haveLyric){
        var lyricNum = that.getLyric(cur)
        var scrlloTop = that.data.clientHeight * lyricNum / that.data.lyricShow.length
      }else{
        lyricNum = 0
        scrlloTop = that.data.scHeight
      }
        that.setData({
          sliderValue:(cur*100)/duration,
          top: scrlloTop,
          currentIndex:lyricNum,
          imageRotate: 'imageCircle',
          cur:cur,
        })
      //  console.log(lyricContent)
      //  console.log("+++++++")
      })
      //自然播放完成后
      innerAudioContext.onEnded(function (){
        that.setData({
          playicon: '/images/icons/on.png',
          sliderValue:0,
          isplay:true,
          haveLyric:true,
          imageRotate:""
        })
      })

    }
    else{
      var that = this;
      innerAudioContext.pause();
      that.setData({
        playicon:'/images/icons/on.png',
        name:"on",
        isplay:true,
        imageRotate:""
      })
    }
  },

  // 歌词整理
  parseLyric:function() {
    var getLyric = this.data.lyric;
    var lyricList = getLyric.split("&#10;");
    var lyriced = [];
    for(var i=0; i< lyricList.length;i++){
      //过滤掉歌词前几个不需要的
      if(i>=5){
        var temp = lyricList[i]
        var allTime = temp.split("]")[0].replace("[","")
        var selfTime = allTime.split(":")
        //将时间整合为秒
        var min = parseInt(selfTime[0])*60
        var second = parseInt(selfTime[1])
        var msecond = parseInt(selfTime[2])
        var time = min + second + msecond/100
        //歌词内容整理
        var content = temp.split("]")[1].replace(/(&#40;|&#45;|&#41;|&#13;)/g, "").replace(/&#32;/g, "&nbsp;").replace(/&#39;/g,"'")
        //将每句的时间和内容放到字典中
        if (content){
          var obj = {
            ltime: time,
            lcontent: content
          }
          lyriced.push(obj)
        }else{
          continue
        }
       
      }
    }
    console.log(lyriced)
    this.setData({
      lyricShow: lyriced,
    })

  },

  //歌词滚动
  getLyric:function(e){
    var lyriceds = this.data.lyricShow
    if(lyriceds){
    for(var i in lyriceds){
      if(e >lyriceds[i].ltime){
        continue
      }else{
        return i - 1
      }
    }
    }
  },

  lower:function(){
    this.setData({
      haveLyric:false
    })
  },

  //获取整个歌词内容的高度
  getHeight:function(){
    var that = this
    const query = wx.createSelectorQuery()
    query.select("#lc").boundingClientRect(function (rect) {
      var height = rect.height
      that.setData({
        clientHeight:height
      })
      // that.data.clientHeight = height
    }).exec();
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      songname: options.songName,
      singer:options.singer,
      url : decodeURIComponent(options.songUrl),
      imageurl: decodeURIComponent(options.imageUrl),
      lyric:decodeURIComponent(options.lyric),
      isplay: true,
    });
    this.parseLyric();
    this.getHeight();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (){
    this.onplay()//调用 onplay 播放音
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})