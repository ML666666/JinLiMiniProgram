const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:1,
    isReachBottom:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ windowHeight: app.globalData.windowHeight});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 触底加载更多数据  
  onReachBottom() {
    this.setData({ isReachBottom: this.data.isReachBottom+1})
  },
  changeIndex(e){
    let active = e.currentTarget.dataset.index;
    this.setData({active})
  }
})