const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AEURL:'http://h5.huizhisuo.com/upload/Picture/comment/201911/3d2487fe6b83483ead839125879ddd89.png?v=1.0.43',
    t_0:'http://h5.huizhisuo.com/upload/Picture/comment/201911/b3d671cf30614aeb88ca3f7f2e153ef2.png?v=1.0.43',
    t_1:'http://h5.huizhisuo.com/upload/Picture/comment/201911/c2e71daf4174439b8299ed70431d473e.png?v=1.0.43',
    t_2:'http://h5.huizhisuo.com/upload/Picture/comment/201911/a609d4454d204784987e79cbba0b9b1f.png?v=1.0.43'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.StatisticsAgentOrderInCome().then(res=>{
      this.GetRegionalPartner();
    })
  },
  toMd(){
    wx.navigateTo({
      url: '/pages/me/page/AboutPartner/AboutShopping/AboutShopping',
    })
  },
  GetRegionalPartner(){
    return app.globalData.post('Agent/GetRegionalPartner', {
      isDetail: false,
      CommissionType: this.data.AgentLevel}).then(res=>{
        let list = [];
        this.setData({ GetRegionalPartner:res.data},()=>{
          this.setData({ bandList: this.data.GetRegionalPartner.ShoppingBiRanking.Lst})
          this.setData({ Date: this.data.GetRegionalPartner.ShoppingBiRanking.Date})
        })
    })
  },
  StatisticsAgentOrderInCome(){
    return app.globalData.post('UserCenter/StatisticsAgentOrderInCome',{}).then(res=>{
      this.setData({ AgentLevel: res.data.data.AgentLevel })
      this.setData({ RegionInCome: res.data.data.RegionInCome })
    })
  }
 
})