const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toback() {
    wx.switchTab({
      url: '/pages/KoiWelfare/KoiWelfare',
    })
  },
  onLoad(){
    this.setData({
      baseUrl: app.globalData.gob.config._baseUrl + 'upload/xcx/gouwubihuanqian.png'
    })
  },
  toAddresss() {
    app.globalData.toast('附近尚未搜寻到合作商家')
  },
  onShareAppMessage: function () {

  }
})