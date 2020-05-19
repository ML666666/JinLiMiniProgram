
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // let url = wx.getStorageSync('configUrl');
    // console.log(wx.getStorageSync('token'))
    // this.setData({ url: 'http://192.168.0.138:8080/#/dtactive?token=' + wx.getStorageSync('token')})
    // if (options.type){
    //   let url = wx.getStorageSync('url');
    // this.setData({ url: url ? url :'http://localhost:8080/#/DtActive'})
    // }else{
    //   this.setData({ url: config.customerServiceUrl })
    // }

    // app.globalData.post('UserCenter/index_V2', {}).then(res => {
    //   this.setData({ haveLoad: res.data.success == 200 });
    // })

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // url = url.includes('?') ? url + `&token=${wx.getStorageSync('token')}` : url + `?token=${wx.getStorageSync('token')}`
  onShow: function () {
    // let base = app.globalData.gob.config.baseUrl;
    // let returnMd5 = app.globalData.gob.returnMd5;
    // let url = wx.getStorageSync('webViewUrl');
    // let timeString = new Date().getTime().toString();
    // let token = wx.getStorageSync('token');
    // let byMd5 = {};
    // let timeStamp = timeString.substr(0, timeString.length - 3)
    // let sign = returnMd5(timeStamp+token+'oUqJa1EmXKbY580Z3-fBTphbSO6U@6bac79e2978b4ad6ba07fce6a9720fc0');
    // url = `${base}Index/index?retUrl=https%3a%2f%2fwww.huizhisuo.com%2fxcx%2findex.html%23%2fDtActive&token=${token}&timeStamp=${timeStamp}&sign=${sign}`
    app.globalData.post('UserCenter/index_V2', {}).then(res => {
      this.setData({ haveLoad: res.data.success == 200 });
      if (res.data.success!=200){
        wx.navigateTo({
          url: '/pages/Login/Login',
        })
      }else{
        app.globalData.post('Activity/FreeActivityIndex', { token: wx.getStorageSync('token') }).then(res=>{
          console.log(res.data.data.Share);
          this.setData({ share: res.data.data.Share})
        })
      }
    })
    
    this.setData({ url: 'https://wxapi.huizhisuo.com/index.html#/DtActive' + `?token=${wx.getStorageSync('token')}` });

    // this.setData({ url: 'http://192.168.0.248:8080/#/DtActive/' + `?token=${wx.getStorageSync('token')}` });
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
    let shareObj = app.globalData.interceptShare(null, this.data.share.title, this.data.share.ico, this.data.share.desc,true)
    return shareObj
  },
})