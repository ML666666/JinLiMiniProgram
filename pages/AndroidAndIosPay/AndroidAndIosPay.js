const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj:{},
    EObj:{},
    isPaySuccessCode:2,
    isLoginFail:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('token', options.token);
    this.setData({ Client: options.client});
    this.setData({ orderType: options.orderType });
    this.setData({ obj: JSON.stringify(options)});
    this.setData({ OrderIdList: options.OrderIdList})
    this.toPay();
  },
  launchAppError(e) {
    this.setData({ EObj: JSON.stringify(e.detail.errMsg)})
  },

  toPay(){
    let _this = this;
    app.globalData.post('YopPay/GoPay', {
      GroupOrderIdList: '',
      OrderIdList: this.data.OrderIdList,
      payType: 10000,
      version: 11,
      token: this.data.token,
      orderType: this.data.orderType
    }).then(res => {
      this.setData({ obj: JSON.stringify(res) })
      if (res.data.success == 200) {
        _this.setData({ isLoginFail: false });
        let retData = res.data.retData ? JSON.parse(res.data.retData) : res.data.retData;
        try {
          wx.requestPayment({
            timeStamp: retData.timeStamp,
            nonceStr: retData.nonceStr,
            package: retData.package,
            signType: retData.signType,
            paySign: retData.paySign,
            success(res) {
              _this.setData({ isPaySuccessCode: 1 });
              getApp().globalData.toast("支付成功");
            },
            fail(res) {
              _this.setData({ isPaySuccessCode: 0 });
              getApp().globalData.toast("支付已取消");
            }
          })
        } catch (e) {
          _this.setData({ isPaySuccessCode: 0 });
          getApp().globalData.toast("支付失败");
        }
      }else{
        _this.setData({ isLoginFail:true });
        wx.navigateTo({
          url: '/pages/Login/Login',
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
    if(this.data.isLoginFail){
      this.toPay();
    }
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