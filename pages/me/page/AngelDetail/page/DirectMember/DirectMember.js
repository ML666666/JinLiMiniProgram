const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [''],
    userObj:null,
    PageIndex: 1,
    PageSize: 10,
    List:[],
    isOver:false,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true,
    isPopupShow:false
  },
  refresh(){
    this.isRefreshing();
    this.setData({PageIndex:1},()=>{
      let obj = {
        PageIndex: this.data.PageIndex,
        PageSize: this.data.PageSize,
      }
      app.globalData.post('Agent/GetMyTeam', obj).then(res => {
        this.setData({ userObj: res.data.data });
        this.setData({ List: res.data.list });
        this.setData({ isOver: res.data.list.length < this.data.PageSize ? true : false });
        this.isRefreshing();
      })
    })
  },
  isRefreshing(isRenderingPage=false){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing,
    })
    isRenderingPage ? this.setData({ isRenderingPage: !this.data.isRenderingPage}):null
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  onLoad: function (options) {
    let obj = {
      PageIndex: this.data.PageIndex,
      PageSize: this.data.PageSize,
    }
    app.globalData.post('Agent/GetMyTeam',obj).then(res=>{
      this.setData({ userObj:res.data.data});
      this.setData({ List:res.data.list});
      this.setData({ isOver: res.data.list.length<this.data.PageSize?true:false});
      this.isRefreshing(true);
    })
  },
  onReachBottom: function () {
    if (this.data.isOver){
      return
    }
    this.setData({loading: true})
    let PageIndex = this.data.PageIndex+1;
    app.globalData.post('Agent/GetMyTeam', { PageIndex, PageSize: this.data.PageSize}).then(res => {
      this.setData({ List: [...this.data.List,...res.data.list]});
      this.setData({ isOver: res.data.list.length < this.data.PageSize ? true : false });
      this.setData({ loading: false })
      this.setData({ PageIndex })
    })
  },
  makePhoneCall(){
    wx.makePhoneCall({
      phoneNumber: this.data.userObj.Phone,
    })
  },
  copyTBL(){
    if (this.data.userObj.WechatNumber == null){
      app.globalData.toast('邀请人微信号为空。');
      return
    }
    wx.setClipboardData({
      data: this.data.userObj.WechatNumber,
    })
  },
  CanCelStatus(){
    this.setData({ isPopupShow: !this.data.isPopupShow})
  }
})