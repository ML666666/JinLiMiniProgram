const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isGetUserInfo:false,
    PromotionObj:null,
    AgentObj:null,
    MyTeam:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let GetAgent = app.globalData.post('Agent/GetAgent',{})
      let GetPromotionCenter = app.globalData.post('Agent/GetPromotionCenter',{})
      let GetMyTeam = app.globalData.post('Agent/GetMyTeam',{})
      Promise.all([GetAgent, GetPromotionCenter, GetMyTeam]).then(res=>{
        this.setData({ AgentObj:res[0].data},()=>{
          this.data.AgentObj.WechatNumber?this.setData({isGetUserInfo:false}):this.setData({isGetUserInfo:true});
        })
        this.setData({ PromotionObj:res[1].data});
        this.setData({ MyTeam:res[2].data.data})
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  changeIsGetUserInfo(){
    this.setData({ isGetUserInfo: !this.data.isGetUserInfo });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  toRule(){
    wx.navigateTo({
      url: '/pages/AngelGiftBag/AboutAngel/AboutAngel',
    })
  },
  cancel(){
    this.setData({ isGetUserInfo: !this.data.isGetUserInfo});
  },
  yaoqing(){
    wx.navigateTo({
      url: '/pages/me/page/ShareQtCode/ShareQtCode',
    })
  },
  toMaterialCircle(){
    wx.navigateTo({
      url: '/pages/me/page/AngelDetail/page/MaterialCircle/MaterialCircle',
    })
  },
  toMyTeam(){
    wx.navigateTo({
      url: '/pages/me/page/AngelDetail/page/DirectMember/DirectMember',
    })
  },
  toMyEarnings(){
    wx.navigateTo({
      url: '/pages/me/page/AngelDetail/page/MyEarnings/MyEarnings',
    })
  },
  HtmlApp(e){
    let good_id = e.currentTarget.dataset.good_id;
    wx.navigateTo({
      url: `/pages/me/page/AngelDetail/page/HtmlApp/HtmlApp?Good_id=${good_id}`,
    })
  },
  PromotionRewards(e){
    wx.navigateTo({
      url: '/pages/me/page/AngelDetail/page/PromotionRewards/PromotionRewards',
    })
  }
})