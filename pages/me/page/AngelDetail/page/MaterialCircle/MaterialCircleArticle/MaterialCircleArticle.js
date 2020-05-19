const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ArtucleObj:{},
    ShareObj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.post('Articles/GetDetail', { id:options.id}).then(res=>{
      console.log(res.data);
      this.setData({ ArtucleObj:res.data.data});
      this.setData({ ShareObj: res.data.share });
    })
  },
  onShow(){

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})