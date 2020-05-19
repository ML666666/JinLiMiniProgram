// pages/search/MessageQueue/MessageQueue.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LinOut:false,
    list:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // Account / GetMyMessageLstGroup
    app.globalData.post('Account/GetMyMessageLstGroup',{}).then(res=>{
      this.setData({ list:res.data.list })
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
  toDetail(e){
    let obj = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/search/MessageQueue/page/MessageDetail/MessageDetail?name=${obj.name}&type=${obj.type}`,
    })
  }
})