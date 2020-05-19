const app = getApp();
import ZT from '../../gob/ZT.js'
Page({

  data:{
    ChannelLstData:[],
    youlike:{
      pageindex: 1,
      list: [],
      isOver: false,
    },
    pagesize:10,
    isLoadingMyLike: false,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true,
    haveLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onShow(){
    if (this.data.haveLogin){
      Promise.all([this.isLogin(), this.getPageData()])
    }
  },
  changeAddress(){
    let _this = this;
    wx.getLocation({
      success(res) {
        wx.setStorageSync('_Location', res); // latitude维度 longitude经度
        _this.getDZ(res).then(()=>{
          app.globalData.toast('刷新地址成功')
        });
      }
    })
  },
  getW(){
    let _this = this;
    let Location = wx.getStorageSync('_Location');
    if (!Location) {
      wx.getLocation({
        success(res) {
          wx.setStorageSync('_Location', res); // latitude维度 longitude经度
          Location = res;
          _this.getDZ(Location);
        },
        fail() {
          _this.getW();
        }
      })
    }else{
      _this.getDZ(Location)
    }
  },
  getDZ(Location){
    return new Promise((resolve,reject)=>{
      let obj = {
        Locat: JSON.stringify({ LngLatStr: `${Location.longitude},${Location.latitude}` }),
        LngLatStr: `${Location.longitude},${Location.latitude}`
      }
      app.globalData.post('index/GetAddress', obj).then(res => {
        if(res.data.success==200){
          this.setData({ addressComponent: res.data.result.addressComponent })
          resolve(res);
        }else{
          app.globalData.toast(res.data.msg);
        }
      })
    })
  },
  isrefreshing(isRenderingPage=false){
    this.setData({ refreshing: !this.data.refreshing });
    this.setData({ refreshed: !this.data.refreshed });
    isRenderingPage ? this.setData({ isRenderingPage: !this.data.isRenderingPage}):""
  },
  onLoad: function (options) {
    this.getW();
    this.setData({ NowData: Date.parse(new Date()) })
    Promise.all([this.isLogin(),this.getPageData()]).then(res=>{
      this.isrefreshing(true);
      this.setData({haveLogin:true});
    })
  },
  isLogin(){
    return new Promise((resolve, reject) => {
      app.globalData.post('UserCenter/index_V2', {}).then(res => {
        this.setData({ isLogin: res.data.success == 200 })
        resolve(res);
      })
    })
  },
  getPageData(){
    return new Promise((resolve,reject)=>{
      app.globalData.post('Special/GetSpecialPage', { SpecialPageId: 11 }).then(res => {
        let ChannelLstData = res.data.data.JsonData;
        this.setData({ shoppingBalance: Number(res.data.shoppingBalance).toFixed(2)})
        this.setData({ ChannelLstData }, () => {
          this.inityouLike();
          resolve(res);
        })
      })
    })
  },
  inityouLike() {
    let ChannelLstData = this.data.ChannelLstData;
    let categoryList = ChannelLstData.categoryList;
    if (categoryList) {
      let youlike = this.data.youlike;
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
        this.setData({ youlike, isLoadingMyLike: false });
      })
    }
  },
  onReachBottom: function () {
    this.inityouLike()
  },
  getMyLike(categoryList, pageindex = 1) {
    return new Promise((resolve, reject) => {
      app.globalData.post('Special/MyLovePro',
        { categoryList: JSON.stringify(categoryList), pageindex, pagesize: this.data.pagesize }).then(res => {
          resolve(res.data.Pro);
        })
    })
  },
  refresh(){
    this.isrefreshing();
    this.getPageData().then(res=>{
      this.isrefreshing();
    })
  },
  getBeClickCannelObj(e) {
    ZT(e);
  },
  onShareAppMessage: function () {

  }
})