const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AgentFrozenBalance:null,
    DeductionBalance:null,
    balance:null,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetBalance().then(res=>{
      this.setData({haveLoad:true});
      this.isRefreshing();
      this.setData({ isRenderingPage: !this.data.isRenderingPage });
    })
  },
  checkDetail(){
    wx.navigateTo({
      url: '/pages/me/page/RemainingSum/TouchBalance/TouchBalance?name=余额明细&type=1',
    })
  },
  tixian(){
    wx.navigateTo({
      url: '/pages/me/page/RemainingSum/getBalance/getBalance',
    })
  },
  checkPrice(){
    wx.navigateTo({
      url: '/pages/me/page/RemainingSum/TouchBalance/TouchBalance?name=冻结明细&type=2',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  isRefreshing(){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing
    })
  },
  refresh(){
    this.isRefreshing();
    this.GetBalance().then(res => {
      this.isRefreshing();
    });
  },
  onShow: function () {
    if(this.data.haveLoad){
      this.GetBalance().then(res=>{
        this.isRefreshing();
        this.setData({ isRenderingPage: !this.data.isRenderingPage });
      });
    } 
  },
  onHide(){
    setTimeout(()=>{
      this.isRefreshing();
      this.setData({ isRenderingPage: !this.data.isRenderingPage });
    },200)
  },
  GetBalance(){
    return new Promise((resolve,reject)=>{
      app.globalData.post('UserCenter/GetBalance', {}).then(res => {
        resolve(res);
        this.setData({
          AgentFrozenBalance: res.data.AgentFrozenBalance,
          DeductionBalance: res.data.DeductionBalance,
          balance: res.data.balance
        })
      })
    })
  }
})