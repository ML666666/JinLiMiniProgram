const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    name:null,
    type:0,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true
  },
  onLoad: function (options) {
    this.setData({ type: options.type, name:options.name},()=>{
      this.GetBalanceLog().then(res => {
        this.isRefreshing();
        this.setData({ isRenderingPage: !this.data.isRenderingPage})
        this.setData({ list: res.data.list });
      })
    });
  },
  isRefreshing(){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing
    })
  },
  refresh(){
    this.isRefreshing();
    this.GetBalanceLog().then(res => {
      this.isRefreshing();
      this.setData({ list: res.data.list });
    })
  },
  GetBalanceLog(){
    return app.globalData.post('UserCenter/GetBalanceLog', { type: this.data.type })
  }
})