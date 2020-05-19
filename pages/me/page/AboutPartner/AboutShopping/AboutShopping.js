const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  resetTime(e) {
    this.setData({ startValue: e.detail.startValue, endValue: e.detail.endValue }, () => {
      app.globalData.post('Agent/ShoppingBiOutput', {
        startDate: this.data.startValue,
        endDate: this.data.endValue,
      }).then(res => {
        this.setData({
          row: res.data.ShoppingBiRanking
        })
      })
    })
  }
})