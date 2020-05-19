const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgUrl:'http://h5.huizhisuo.com/upload/Picture/comment/201912/f4c1f921d6554d17868e23f78e42e6ce.png?v=1.0.36',
    btnUrl:'http://h5.huizhisuo.com/upload/Picture/comment/201912/f1ef7e6856b74c9688908c54bb138e15.png?v=1.0.36',
    windowHeight: app.globalData.windowHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  Tap(){
    app.globalData.post('Activity/ReceiveShoppingCurrency',{}).then(res=>{
      app.globalData.toast(res.data.msg);
      if (res.data.success==200){
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/KoiWelfare/KoiWelfare',
          })
        }, 2500)
      }
    })
  }
  
})