// pages/AngelGiftBag/AngelGiftBag.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageindex: 1,
    pagesize: 6,
    list:[],
    isOver:false,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true,
  },
  refresh(){
      this.isRefreshIng();
      this.setData({
        isOver:false,
      }, () => { this.getList(1).then(res => { this.isRefreshIng();})})
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  isRefreshIng(){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing,
    })
  },
  onLoad(){

    this.getList(1).then(res=>{
      this.setData({isRenderingPage:false});
      this.isRefreshIng();
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList();
  },
  toGoodDetail(e) {
    wx.navigateTo({
      url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${e.currentTarget.dataset.id}&goodtype=1`,
    })
  },
  // 获取数据
  getList(_pageindex){
    return new Promise((resolve,reject)=>{
      if (this.data.isOver){
        return
      }
      let pageindex = _pageindex ? _pageindex:this.data.pageindex+1;
      console.log(pageindex);
      let obj = {
        pageindex: pageindex,
        pagesize: this.data.pagesize
      }
      let post = app.globalData.post('Activity/ProductLstByLiBao', obj).then(res => {
        this.setData({ list: _pageindex ? [...res.data.lst]:[...this.data.list, ...res.data.lst], pageindex},
          ()=>{
            res.data.lst.length<this.data.pagesize?
            this.setData({isOver:true}):null;
            resolve(res);
        });
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  toAngel(){
    wx.navigateTo({
      url: '/pages/AngelGiftBag/AboutAngel/AboutAngel',
    })
  },
  onShareAppMessage: function () {
    let shareObj = app.globalData.interceptShare()
    return shareObj
  },
})