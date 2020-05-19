const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSpecialSellBgColor:true, //是否为渐变背景状态
    specialSellBgColor:'', //当前轮播背景色
    top: 0, //Tabs高度
    category:[],//头部分类列表
    activeCancelRenderTop:0,//吸顶Tabs的触发高度
    RecommendType: null,//RecommendType 
    targetIndex:0,//当前Active的tab对应的index 默认为0
    allData:[],
    isLoading:false,//是否加载更多数据中
    pagesize:10,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true
  },
  isRefreshing(){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ top: app.globalData.navHeight });//根据系统信息为Tabs设定动态高度
    Promise.all([this.Getcategory(), this.getSpecialSellData(), this.getMsg()]).then(res=>{
      //缓存Tabs信息
      this.setData({ category: res[0].data.rows });
      //获取tabs信息后，获取第一个tab对应的RecommendType
      let RecommendType = res[0].data.rows[this.data.targetIndex].RecommendType;
      
      // 缓存特卖数据
      this.setData({ specialSellBgColor: res[1][0].data.data.broadcastAd[0].BackgroundColor })
      this.setAllData({ topData: res[1][0].data.data, list: res[1][1] }, 0);
      
      if(res[2].data.success==400){
        this.setData({LoginFail:true})
      }else{
        this.setData({ Msglist: res[2].data.list },()=>{
          let MsgNum = 0;
          for(let v in this.data.Msglist){
            MsgNum = MsgNum + this.data.Msglist[v].noReadNum
          }
          this.setData({ MsgNum })
        });
      }

      // 取消loading
      this.setData({ isRenderingPage:false})
      this.isRefreshing();

    })
  },
  onShow(){
    if (this.data.LoginFail){
      this.getMsg().then(res=>{
        this.setData({LoginFail:!this.data.LoginFail});
        this.setData({ Msglist:res.data.list });
      })
    }
  },
  // 获取头部分类列表
  Getcategory() {
    return new Promise((resolve, reject) => {
      let post = app.globalData.post('index/getcategory_v2', {}).then(res => {
        resolve(res);
      })
    })
  },
  //切换Tabs促发该方法
  getActiveObj(e){
    this.setData({
      RecommendType: e.detail.RecommendType,
      targetIndex:e.detail.index,
      isSpecialSellBgColor:e.detail.index==0?true:false
    },()=>{
      
      if(this.data.targetIndex != 0 && !this.getAllData(this.data.targetIndex)){
        this.isRefreshing();
        this.getOrderData().then(res => {
          this.setAllData({
            topData: res[0].data,
            bodyData: res[1].data
          }, this.data.targetIndex);
          this.isRefreshing();
        })
      }
    })
  },
  // 前往信息
  toMsg(){
    this.data.LoginFail ? wx.showModal({
      title: "提示",
      content: "请先登录",
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/Login/Login',
          })
        }
      }
    }) : wx.navigateTo({
      url: '/pages/search/MessageQueue/MessageQueue',
    })
  },
  //获取特卖顶部数据
  getSpecialSellTop() {
    return new Promise((resolve, reject) => {
      let post = app.globalData.post('Index/IndexCenterData', {});
      post.then((res) => {
        resolve(res);
      })
    })
  },
  getMsg(){
    return app.globalData.post("Account/GetMyMessageLstGroup",{})
  },
  //获取特买列表数据
  getSpecialSellList(pageindex) {
    return new Promise((resolve,reject)=>{
      let post = app.globalData.post('Index/getindexintegralproduct_v2', {
        pageindex: pageindex,
        pagesize: 10
      });
      post.then((res) => {
        let ary = [];
        // 计算折扣
        for (let i in res.data.rows) {
          let num = ((res.data.rows[i].MemberPrice / res.data.rows[i].MarketPrice)
          .toFixed(2) * 100).toString().split("").join(".");
          res.data.rows[i]._count = num.substr(0, 3);
          ary.push(res.data.rows[i])
        }
        resolve(ary);
      })
    })
  },
  //获取特买数据
  getSpecialSellData(pageindex=1){
    let getSpecialSellTop = this.getSpecialSellTop();
    let getSpecialSellList = this.getSpecialSellList(pageindex);
    return Promise.all([getSpecialSellTop, getSpecialSellList])
  },
  //缓存/添加数据
  setAllData(data,index,reLoad=false){
    let getList = function(bodyData, res){
      bodyData.rows = [...bodyData.rows, ...res.rows];
      return bodyData
    }
    let allData = this.data.allData;
    if(index==0){
      allData[index] = {
        topData: data.topData,
        list: typeof (allData[index]) == 'undefined' || reLoad ?
        [...data.list] : [...allData[index].list,...data.list],
        pageindex: typeof (allData[index]) == 'undefined' || reLoad ? 1 : allData[index].pageindex+1,
        isOver: data.list.length<this.data.pagesize?true:false
      }
    }else{
      allData[index] = {
        topData: data.topData,
        bodyData: typeof (allData[index]) == 'undefined' || reLoad ? data.bodyData :
        getList(allData[index].bodyData, data.bodyData),
        pageindex: typeof (allData[index]) == 'undefined' || reLoad ? 1 : allData[index].pageindex + 1,
        isOver: data.bodyData.rows.length < this.data.pagesize ? true : false,
      }
    }
    this.setData({ allData })
  },
  //判断是否有缓存
  getAllData(index){
    return typeof (this.data.allData[index]) != 'undefined'
  },
  //特卖组件轮播监听
  specialSellSwiperChange(e){
    this.setData({ specialSellBgColor: e.detail.specialSellBgColor})
  },
  //获取来自子组件的activeTop
  getActiveTop(e){
    this.setData({ activeTop:e.detail.activeTop})
  },
  //监听滚动
  onPageScroll(e) {
    if (this.data.targetIndex == 0) {
      if (e.scrollTop > this.data.activeTop) {
        this.setData({ isSpecialSellBgColor:false})
      }else{
        this.setData({ isSpecialSellBgColor:true})
      }
    }
  },
  // 触底加载更多数据  
  onReachBottom() {
    this.setData({ isLoading:true})
    if(this.data.targetIndex==0){
      let topData = this.data.allData[0].topData;
      let pageindex = this.data.allData[0].pageindex;
      this.getSpecialSellList(++pageindex).then(res=>{
        this.setAllData({ topData: topData, list: res }, this.data.targetIndex);
        this.setData({ isLoading:false});
      })
    }else{
      let pageindex = this.data.allData[this.data.targetIndex].pageindex;
      this.getOrderData(++pageindex,false).then(res=>{
        this.setAllData({
          topData: this.data.allData[this.data.targetIndex].topData,
          bodyData: res.data
        }, this.data.targetIndex)
      })
    }
  },
  
  // 获取特卖数据外的其他数据
  getOrderData(pageindex=1,LoadAllData=true){  
      var obj = {
        RecommendType: this.data.RecommendType,
        categoryid: 0,
        pageindex: pageindex,
        pagesize: this.data.pagesize
      }
      if (LoadAllData){
        let postCannal = app.globalData.post('index/getcategoryTopData', obj);
        let postList = app.globalData.post('index/getcategoryproduct', obj);
        return Promise.all([postCannal, postList])
      }else{
        return app.globalData.post('index/getcategoryproduct', obj);
      }
  }, 

  refresh(){
    this.isRefreshing();
    if(this.data.targetIndex == 0){
      this.getSpecialSellData(1).then(res => {
        this.setAllData({ topData: res[0].data.data, list: res[1] }, 0,true);
        this.isRefreshing();
      })
    }else{
      this.getOrderData(1).then(res => {
        this.setAllData({
          topData: res[0].data,
          bodyData: res[1].data
        }, this.data.targetIndex,true)
        this.isRefreshing();
      },true) 
    }
  },
  onShareAppMessage: function () {
    let shareObj = app.globalData.interceptShare()
    return shareObj
  },
})