const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SPURL:'http://h5.huizhisuo.com/upload/Picture/comment/201911/f17e82155aa3477a849a88c60d783d4d.png?v=1.0.43',
    Dyu:'http://h5.huizhisuo.com/upload/Picture/comment/201911/0fe0a1b089d8493380b49343080e4588.png?v=1.0.43',
    AddUrl:'http://h5.huizhisuo.com/upload/Picture/comment/201911/e88fedf225f84563ac3e73c8b1913e2d.png?v=1.0.43'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Promise.all([this.getGetRegionalPartner(), this.getStatisticsAgentOrderInCome()]).then(res=>{
      this.setData({ RegionalPartner: res[0].data})
      this.setData({ AgentOrderInCome: res[1].data.data })
    })
  },
  getGetRegionalPartner(){
    return new Promise((resolve,reject)=>{
      app.globalData.post('Agent/GetRegionalPartner', { CommissionType:4,isdetail:false}).then(res=>{
        resolve(res);
      })
    })
  },
  getStatisticsAgentOrderInCome(){
    return new Promise((resolve, reject) => {
      app.globalData.post('UserCenter/StatisticsAgentOrderInCome', {}).then(res => {
        resolve(res)
      })
    })
  }
})