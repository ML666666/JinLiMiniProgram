// pages/me/me.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data:{
    windowHeight:null,
    userObj:null,//用户数据
    refreshed:false,//控制下拉刷新的变量
    refreshing:true,
    isRenderingPage:true,
    orderNum:{},//存储各类订单数的对象
    failToLogin:false,
    haveLoad:false,
    GroupNoList:[],
    Adlst:[]
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
  onLoad: function () {
    this.setData({ windowHeight: app.globalData.windowHeight});
    this.GetInfo().then(res=>{
      if (res){
        this.setData({ haveLoad:true}); //表明已加载数据成功
        this.isRefreshing();
        this.setData({ isRenderingPage: !this.data.isRenderingPage });
      }else{
        this.setData({failToLogin:true});
      }
    })
  },
  onShow(){
    if(this.data.failToLogin){
      this.GetInfo().then(res => {
          this.isRefreshing();
          this.setData({ haveLoad: true });
          this.setData({isRenderingPage: !this.data.isRenderingPage,failToLogin: !this.data.failToLogin,});
      })
    }else{
      // 如果已加载数据成功 则每次进来都重新获取一次数据
      if(this.data.haveLoad){
        this.GetInfo()
      }
    }
  },
  // onHide(){
  //   setTimeout(()=>{
  //     this.isRefreshing();
  //     this.setData({ isRenderingPage: !this.data.isRenderingPage });
  //   },300)
  // },
  // 获取用户数据 1.用户数据 2.订单数据
  GetInfo(){
    return new Promise((resolve,reject)=>{
      this.GetUserData().then(res => {
        res.data.success == 200 ?
          Promise.all([this.GetInTheGroupOrder(), this.GetOrderNum(), this.GetBottomInfo(), this.GetAdvertisements()]).then(res=>{
          resolve(true);
        }) : resolve(false);
      });
    })
  },
  // Platform/GetAdvertisements
  GetAdvertisements(){
    return app.globalData.post('Platform/GetAdvertisements', { AdType:  3}).then(res => {
      this.setData({ Adlst: res.data.lst });
    })
  },
  GetInTheGroupOrder(){
    return app.globalData.post('Order/GetInTheGroupOrder',{}).then(res=>{
      this.setData({ GroupNoList:res.data.list});
    })
  },
  GetBottomInfo(){
    return new Promise((resolve, reject) => {
      app.globalData.post('UserCenter/StatisticsAgentOrderInCome', {}).then(res => {
        this.setData({ BottomInfo: res.data.data });
        resolve(true)
      })
    })
  },
  //获取用户数据
  GetUserData(){
    return new Promise((resolve,reject)=>{
      app.globalData.post('UserCenter/index_V2', {}).then(res => {
        res.data.success == 200 ? this.setData({ userObj: res.data}) : app.globalData.toast(res.data.msg);
        resolve(res);
      })
    })
  },
  //获取订单数据
  GetOrderNum(){
    return new Promise((resolve, reject) => {
      app.globalData.post('Order/GetOrderNum',{}).then(res=>{
        res.data.success == 200 ? this.setData({ orderNum: res.data.orderNum }) : app.globalData.toast(res.data.msg);
        resolve(res.data);
      })
    })
  },

  //前往分类列表
  toDetail(e){
    let obj = e.currentTarget.dataset;
    let categoryid = obj.categoryid;
    let productid = obj.productid;
    let specialareatype = obj.specialareatype;
    let title = obj.title ? obj.title:'';
    if (specialareatype>0){
      if (specialareatype==1){
        wx.navigateTo({
          url: '/pages/Active/FreeOfCharge/FreeOfCharge',
        })
      }
      if(specialareatype==2){
        wx.navigateTo({
          url: '/pages/Active/LuckyDouble/LuckyDouble',
        })
      }
      return
    }
    if (productid>0){
      wx.navigateTo({
        url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${productid}`,
      })
      return
    }
    if (categoryid>0){
      wx.navigateTo({
        url: `/pages/TypeList/TypeList?categoryid=${categoryid}&title=${title}`,
      })
      return
    }
  
  },
  //前往订单分类列表
  toList(e){
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url:`/pages/me/page/orderList/orderList?index=${index}`,
    })
  },
  //页面刷新
  refresh() {
    this.isRefreshing();
    this.GetInfo().then(res=>{
      this.isRefreshing();
    });//下拉刷新用户数据
  },
  //实用工具里的页面跳转
  toOrderPage(e) {
    let type = e.currentTarget.dataset.type;
    let path = type ? e.currentTarget.dataset.path + `?type=${type}` : e.currentTarget.dataset.path;
    path?wx.navigateTo({
      url: path,
    }):app.globalData.toast('敬请期待');
  },
})