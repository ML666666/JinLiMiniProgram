// pages/TypeList/TypeList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryid:0,
    type:0,
    title:null,
    category:[],
    navHeight:null,
    targetIndex:0,
    pageindex:1,
    pagesize:10,
    isOver:false,
    RecommendType:null,
    isRenderingPage: true,
    refreshed: false,
    refreshing: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    

    this.setData({
      categoryid: options.categoryid,
      RecommendType: options.type,
      title:options.title
    },()=>{
      this.getcategory().then(res => {
        this.getOrderData().then(res => {
          //处理初始化时Tabs高亮下划线不显示的问题
            this.setData({ targetIndex: 1 })
            this.setData({ targetIndex: 0 })

          this.setData({ isRenderingPage: !this.data.isRenderingPage, })
          this.isRefreshing();
        });
      });
    })
    this.setData({ navHeight: app.globalData.navHeight });
  },
  // 改变Tabs触发回调函数
  getActiveObj(activeObj){
    this.isRefreshing();
    this.setData({
        targetIndex: activeObj.detail.index, 
        RecommendType: activeObj.detail.RecommendType,
        categoryid: activeObj.detail.CategoryId,
        pageindex: 1,
        pagesize: 10,
        isOver: false,
      },
      ()=>{
        this.getOrderData().then(res=>{
          this.isRefreshing()
        });      
    })
  },
  //获取商品列表
  getcategoryproduct(pageindex = this.data.pageindex){
    return new Promise((resolve,reject)=>{
      var obj = {
        RecommendType: this.data.RecommendType,
        categoryid: this.data.categoryid,
        pageindex: pageindex,
        pagesize: this.data.pagesize
      }
      app.globalData.post('index/getcategoryproduct', obj).then(res => {
        this.setData({
          orderCannal_2: res.data
        })
        resolve(res.data);
      });
    })
  },
  //获取头部列表getActiveObj
  getcategory(){
    return new Promise((resolve,reject)=>{
      app.globalData.post('index/getcategory', { 
        RecommendType: this.data.RecommendType,
        categoryid: this.data.categoryid
      }).then(res => {
        this.setData({ category: res.data.rows});
        resolve(res.data.rows);
      })
    })
  },
  getOrderData(){
    return new Promise((resolve,reject)=>{
      var obj = {
        RecommendType: this.data.RecommendType,
        categoryid: this.data.categoryid,
        pageindex: this.data.pageindex,
        pagesize: this.data.pagesize
      }
      let postCannal = app.globalData.post('index/getcategoryTopData', obj)
      let postList = app.globalData.post('index/getcategoryproduct', obj);
      Promise.all([postCannal, postList]).then(res => {
        this.setData({
          orderCannal: res[0].data,
          orderCannal_2: res[1].data
        })
        resolve(res.data)
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  isRefreshing(){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing
    })
  },
  refresh(){
    this.isRefreshing()
    this.getcategoryproduct().then(res => {
      this.isRefreshing();
    });      
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let shareObj = app.globalData.interceptShare()
    return shareObj
  },
})