const app = getApp();
import ZT from '../../gob/ZT.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refreshed:true,
    refreshing:false,
    isRenderingPage:false,
    targetIndex:0,
    GetChannelObjLst:[],
    SpecialPageId:null,//频道Id
    isSpecialSellBgColor:true,
    scrollTop:0,
    isRenderTop: 200,
    refreshing:true,
    refreshed:false,
    isRenderingPage:true,
    pagesize:8,
    isLoadingMyLike:false,
    hotKeyWord:[],
    NowData:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  isRefreshing(isRenderingPage=false){
    this.setData({ refreshing: !this.data.refreshing});
    this.setData({ refreshed: !this.data.refreshed});
    isRenderingPage ? this.setData({ isRenderingPage: !this.data.isRenderingPage}):null
  },
  onLoad: function (options){

    this.setData({NowData:Date.parse(new Date())})
    this.InitData().then(res=>{
      this.isRefreshing(true);
    });
    this.setData({ windowHeight: app.globalData.windowHeight});

  },
  InitData(){
    return new Promise((resolve,reject)=>{
      this.GetChannelLst().then(res => {
        let GetSpecialPage = app.globalData.post('Special/GetSpecialPage', { SpecialPageId: res.data.data[0].JumpValue });
        let GetSearchHotWords = app.globalData.post('Platform/GetSearchHotWords',{})
        this.setData({ GetChannelLst: res.data.data });
        this.setData({ SpecialPageId: res.data.data[0].JumpValue });

        Promise.all([GetSpecialPage, GetSearchHotWords]).then(res => {
          this.setData({ imgDomain: res[0].data.imgDomain });
          this.setData({ imgVersion: res[0].data.imgVersion });
          let GetChannelObjLst = this.data.GetChannelLst.map((item) => { item['ChannelLstData'] = []; return item; })
          GetChannelObjLst[0].ChannelLstData = res[0].data.data.JsonData;
          this.setData({ hotKeyWord:res[1].data.lst })
          this.setData({ GetChannelObjLst }, () => { this.inityouLike();});
          resolve(true);
        })
      })
    })
  },
  getActiveObj(e){
    let GetChannelObjLst = this.data.GetChannelObjLst;
    let SpecialPageId = e.detail.RecommendType;
    let targetIndex = e.detail.index;
    this.setData({ SpecialPageId, targetIndex },()=>{
      if (targetIndex == 0) {
        this.setData({ isSpecialSellBgColor: this.data.scrollTop < this.data.isRenderTop });
      } else {
        this.setData({ isSpecialSellBgColor: false });
      }
      // this.isRefreshing();
      if (GetChannelObjLst[targetIndex].ChannelLstData.list){
        wx.pageScrollTo({ scrollTop: 0, duration: 400 })
        return
      }else{
        this.isRefreshing();
      }
      app.globalData.post('Special/GetSpecialPage', { SpecialPageId }).then(res => {
        this.isRefreshing();
        GetChannelObjLst[targetIndex].ChannelLstData = res.data.data.JsonData;
        wx.pageScrollTo({ scrollTop: 0, duration: 400 })
        this.setData({ GetChannelObjLst },()=>{
          this.inityouLike();
        })
      })
    })
  },
  refresh(){
    this.isRefreshing();
    if (this.data.GetChannelLst){
      let GetChannelObjLst = this.data.GetChannelObjLst;
      let GetSpecialPage = app.globalData.post('Special/GetSpecialPage', { SpecialPageId: this.data.SpecialPageId });
      let GetSearchHotWords = app.globalData.post('Platform/GetSearchHotWords', {})
      Promise.all([GetSpecialPage, GetSearchHotWords]).then(res => {
        this.isRefreshing();
        GetChannelObjLst[this.data.targetIndex].ChannelLstData = res[0].data.data.JsonData;
        this.setData({ hotKeyWord: res[1].data.lst })
        this.setData({ GetChannelObjLst })
      })
    }else{
      this.InitData().then(res=>{
        this.isRefreshing();
      })
    }
  },
  onReachBottom: function () {
    this.inityouLike()
  },
  inityouLike(){
    let targetIndex = this.data.targetIndex;
    let GetChannelObjLst = this.data.GetChannelObjLst;
    let categoryList = GetChannelObjLst[targetIndex].ChannelLstData.categoryList;
    
    
    if (categoryList) {
      let youlike = GetChannelObjLst[targetIndex].youlike;
      if (typeof (youlike) == 'undefined') {
        youlike = {
          pageindex: 1,
          list: [],
          isOver: false
        }
      }
      if (this.data.isLoadingMyLike || youlike.isOver) {
        return
      }
      this.setData({ isLoadingMyLike: true })
      this.getMyLike(categoryList, youlike.pageindex).then(res => {
        youlike = {
          pageindex: youlike.pageindex + 1,
          list: [...youlike.list, ...res],
          isOver: res.length < this.data.pagesize
        }
        GetChannelObjLst[targetIndex].youlike = youlike;
        this.setData({ GetChannelObjLst, isLoadingMyLike: false });
      })
    }
  },
  getMyLike(categoryList, pageindex=1){
    return new Promise((resolve,reject)=>{
      app.globalData.post('Special/MyLovePro',
        { categoryList: JSON.stringify(categoryList), pageindex, pagesize: this.data.pagesize }).then(res => {
          resolve(res.data.Pro);
      })
    })
  },
  GetChannelLst(){
    return app.globalData.post('Special/GetChannelLst', {})
  },
  onPageScroll(e){
    this.setData({ scrollTop:e.scrollTop });
    this.setData({ isSpecialSellBgColor: e.scrollTop < this.data.isRenderTop && this.data.targetIndex==0 });
  },
  /**
   * 用户点击右上角分享
   */
  getBeClickCannelObj(e){
    ZT(e)
  },
  onShareAppMessage: function () {
    let shareObj = app.globalData.interceptShare();
    shareObj['imageUrl'] = null;
    return shareObj
  }
})