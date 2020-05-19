// pages/me/page/ShareQtCode/ShareQtCode.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urls:[],
    swiperH: '',//swiper高度
    nowIdx: 0,//当前swiper索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    app.globalData.post('/Agent/GetQr',{}).then(res=>{
      this.setData({ urls: res.data.data.urls});
    })
  },
  //获取swiper高度
  getHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth - 2 * 80;//获取当前屏幕的宽度
    var imgh = e.detail.height;//图片高度
    var imgw = e.detail.width;
    console.log(imgw);
    var sH = winWid * imgh / imgw + "px"
    this.setData({
      swiperH: sH//设置高度
    })
  },
  //swiper滑动事件
  swiperChange: function (e) {
    this.setData({
      nowIdx: e.detail.current
    })
  },

  //保存在本地
  savelocal(isShare){
    let urls = this.data.urls[this.data.nowIdx].replace('http://admin.taobaby.cn/', app.globalData.gob.config.baseUrl);
    console.log(urls);
    wx.downloadFile({
      url: urls,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(result) {
            isShare ? app.globalData.toast("保存图片成功！快去分享到朋友圈吧！"):app.globalData.toast("保存成功！");
          },
          fail() {
            // app.globalData.toast('2222');
          }
        })
      },
      fail(res){
        // app.globalData.toast(res);
        // app.globalData.toast(urls);
        // app.globalData.toast('1111');
      }
    })

  },
  toRule(){
    wx.navigateTo({
      url: '/pages/me/page/ShareQtCode/Invite/Invite',
    })
  },
  share(){
    this.savelocal(true);
  },
  onShareAppMessage: function () {
    let shareObj = app.globalData.interceptShare('pages/main/main',null,this.data.urls[this.data.nowIdx])
    return shareObj
  }
})