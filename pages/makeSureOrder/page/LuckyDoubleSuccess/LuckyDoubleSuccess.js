const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.post("account/getmyorderDetail", { orderId: options.OrderIdList}).then(res=>{
      this.setData({rows:res.data.rows})
    })
  },

  toMain(){
    wx.switchTab({
      url: app.globalData.MainPageUrl,
    })
  }
})