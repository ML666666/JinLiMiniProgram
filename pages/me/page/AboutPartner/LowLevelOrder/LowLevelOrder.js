const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data:{
    AEURL: 'http://h5.huizhisuo.com/upload/Picture/comment/201911/3d2487fe6b83483ead839125879ddd89.png?v=1.0.43',
    SPURL: 'http://h5.huizhisuo.com/upload/Picture/comment/201911/f17e82155aa3477a849a88c60d783d4d.png?v=1.0.43',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ CommissionType: options.CommissionType });
    app.globalData.post('Agent/GetRegionalPartnerToday', { CommissionType: options.CommissionType}).then(res=>{
      //this.setData({ InComeObj: options.CommissionType == 4 ? res.data.data.SpecialInCome : res.data.data.RegionInCome});
      console.log(res.data);
      this.setData({topData:res.data})
    })
  },
  resetTime(e){
    this.setData({ startValue: e.detail.startValue, endValue: e.detail.endValue },()=>{
      app.globalData.post('Agent/GetRegionalPartner',{
        startDate: this.data.startValue,
        endDate: this.data.endValue,
        isDetail: true,
        CommissionType: this.data.CommissionType
      }).then(res=>{
        this.setData({
          PObj: res.data
        })
      })
    })
  }
})