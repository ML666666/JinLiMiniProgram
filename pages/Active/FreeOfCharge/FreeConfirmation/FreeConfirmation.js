const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:null
  },
  todetail(e){
    console.log(e)
    wx.navigateTo({
      url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${e.currentTarget.dataset.id}&goodtype=3`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ windowHeight: app.globalData.windowHeight});
    this.setData({ getCoins: options.getCoins ? options.getCoins:1 })
    app.globalData.post('solitaire/getIndexproduct', { type: 1}).then(res=>{
      this.setData({ rows: res.data.rows});
    })
  },
  // 分享
  onShareAppMessage: function () {
    let shareObj = app.globalData.interceptShare(`pages/Active/FreeOfCharge/FreeOfCharge?isaboutme=${0}`, '免单接龙')
    return shareObj
  }
  
})