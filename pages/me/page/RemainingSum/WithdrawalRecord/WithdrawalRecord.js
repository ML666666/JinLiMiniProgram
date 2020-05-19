const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMemberDrawRecord().then(res=>{
      this.setData({obj:res.data});
    })
  },
  getMemberDrawRecord(){
    return app.globalData.post('Account/getMemberDrawRecord',{});
  }
})