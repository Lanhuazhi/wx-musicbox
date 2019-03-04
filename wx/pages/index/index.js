//index.js
//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_url:[
      'http://p1.music.126.net/3EkE22fC1WCsgFwiUch-VQ==/109951163875622458.jpg',
      'http://p1.music.126.net/KmAj9UWpwJVtaZboE9f3xw==/109951163873755554.jpg' ,
      'http://p1.music.126.net/IxNkUHyDLhiyMy6G1rr5hw==/109951163877005478.jpg',
    ],
    indicatorDots:true,
    autoplay:true,
    interval:5000,
    duration:500,
    active:1,
    musics:""
    
  },

  toplay:function(e){
    //传递参数url时需要对url进行编解码
    var songUrl = encodeURIComponent(e.currentTarget.dataset.url)
     /**currentTarget 监听点击事件，为什么是dataset **/
    var songName = e.currentTarget.dataset.songname
    var singer = e.currentTarget.dataset.singer
    var imageUrl = encodeURIComponent(e.currentTarget.dataset.imageurl)
    var lyric = encodeURIComponent(e.currentTarget.dataset.lyric)
    var url = '/pages/playing/playing?singer='+singer+'&songName='+songName
      +'&songUrl='+songUrl+'&imageUrl='+imageUrl+'&lyric='+lyric
    wx.reLaunch({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    wx.request({
      url: 'http://localhost:8080/mine',
      method:'GET',
      success:function(res){
        console.log(res.data)
        //存进本地缓存
        wx.setStorage({
          key: 'key',
          data: res.data,
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.getStorage({
      key: 'key',
      success: function(res) {
        that.setData({
          musics:res.data
        })
      },
    })
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