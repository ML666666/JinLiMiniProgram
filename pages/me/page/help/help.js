// pages/me/page/help/help.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [''],
    list:[]
  },
  onLoad: function (options) {
    app.globalData.post('index/getHelphtml',{}).then(res=>{
      res.data.success==200?this.setData({
        list:res.data.list
      }):app.globalData.toast(res.data.msg);
    })
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  onReady: function () {
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