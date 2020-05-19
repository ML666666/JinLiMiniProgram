// pages/me/page/ShareQtCode/Invite/Invite.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    html:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this  = this;
    wx.getSystemInfo({
      success(res) {
        let screenWidth = res.screenWidth;
        app.globalData.post('index/GetDescHtml', { DescName: "yqgz" }).then(res => {
          res.data.data.html = res.data.data.html.replace(/style="vertical-align:bottom;"/g, `style="width:${screenWidth-24}px;height:auto"`);
          res.data.data.html = res.data.data.html.replace(/src="/g, 'src="http://h5.taobaby.cn/');
          _this.setData({ html: res.data.data.html });
        })  
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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