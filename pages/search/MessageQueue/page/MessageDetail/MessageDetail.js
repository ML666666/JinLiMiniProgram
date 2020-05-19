const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageindex: 1,
    pagesize: 10,
    list:[],
    isOver:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({type:options.type});
      this.setData({name:options.name});
      this.getList().then(res=>{
        this.setData({ list: res.data.list});
        this.setData({ isOver:res.data.list.length<this.data.pagesize?true:false});
      })
      this.setData({ windowHeight: app.globalData.windowHeight});
  },

  getList(pageindex=this.data.pageindex){
    let obj = {
      messageType: this.data.type,
      pageindex: pageindex,
      pagesize: this.data.pagesize
    }
    return app.globalData.post('Account/GetMyMessageLst', obj)
  },
 
  onReachBottom: function () {
    if (this.data.isOver){
      return
    }
    let pageindex = this.data.pageindex+1;
    this.getList(pageindex).then(res=>{
      this.setData({ list: [...this.data.list, ...res.data.list] });
      this.setData({ isOver: res.data.list.length < this.data.pagesize ? true : false });
      this.setData({ pageindex })
    })
  },

  toDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/search/MessageQueue/page/MessageDetail/aboutMsg/aboutMsg?id=${id}`,
    })
  }
})