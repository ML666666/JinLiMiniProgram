const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ReachBottom:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({key:options.key},()=>{
      app.globalData.post('index/GetProductCommentShare', { key: this.data.key }).then(res=>{
        let targetImgObj = res.data.pro.ProductImg.filter((item) => { return item.IsMain == 1 });
        let ImgUrl = targetImgObj.length ? targetImgObj[0].ImgUrl : res.data.pro[0].ImgUrl;
        this.setData({ ImgUrl })
        this.setData({ProObj:res.data.pro});
        this.setData({UserObj:res.data.user});
        this.setData({CommendObj: JSON.parse(res.data.jsonData) })
      })
    });
  },
  toDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/GeneralItemDescription/GeneralItemDescription?id=' + id,
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
    let ReachBottom = this.data.ReachBottom+1;
    this.setData({ ReachBottom })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})