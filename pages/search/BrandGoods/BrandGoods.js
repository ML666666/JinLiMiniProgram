const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    branid:null,
    categoryid:null,
    pagesize:6,
    pageindex:1,
    navHeight:null,
    keyword:'',
    windowHeight:null,
    isOver:false,
    list:[],
    type:0,
    isDown:false,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  isRefreshing(){
    this.setData({
      refreshing: !this.data.refreshing,
      refreshed: !this.data.refreshed
    })
  },
  toSearch(){
    this.setData({ pageindex:1},()=>{
      this.getData().then(res => {
        let list = res.data.rows;
        this.setData({ list: list, isOver: list.length < this.data.pagesize })
      })
    })
  },
  refresh(){
    this.isRefreshing()
    this.setData({pageindex:1},()=>{
      this.getData().then(res => {
        let list = res.data.rows;
        this.isRefreshing()
        this.setData({ list: list, isOver: list.length < this.data.pagesize })
      })
    })
  },
  changeType(e){
    let type = e.currentTarget.dataset.type;
    this.setData({ type, pageindex: 1},()=>{
      if (type == 2) {
        this.setData({ isDown: !this.data.isDown},()=>{
          this.getData().then(res => {
            let list = res.data.rows;
            this.setData({ list: list, isOver: list.length < this.data.pagesize })
          })
        })
      }else{
        this.getData().then(res => {
          let list = res.data.rows;
          this.setData({ list: list, isOver: list.length < this.data.pagesize })
        })
      }
    })
  },
  onLoad: function (options){
    this.setData({
       branid: options.branid, 
       categoryid: options.categoryid, 
       navHeight: app.globalData.navHeight,
       windowHeight: app.globalData.windowHeight
    },()=>{
      this.getData().then(res=>{
        let list = res.data.rows;
        this.setData({ list: list, isOver: list.length < this.data.pagesize});
        this.setData({isRenderingPage:!this.data.isRenderingPage});
        this.isRefreshing()
      })
    })
  },
  getData(pageindex = this.data.pageindex){
    let obj = {
      pageindex: pageindex,
      pagesize: this.data.pagesize,
      categoryid: this.data.categoryid,
      keyword: this.data.keyword,
      sort: this.data.type,
      sortDirection: this.data.isDown?0:1,
      brandId: this.data.branid,
    }
    return app.globalData.post('index/getsearchproduct', obj)
  },
  input(e){
    this.setData({ keyword: e.detail.value })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let shareObj = app.globalData.interceptShare()
    return shareObj
  },
  toGoodDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${id}&goodtype=${0}`,
    })
  },
  onReachBottom(){
    if (this.data.isOver){
      return
    }
    this.setData({loading:true})
    let pageindex = this.data.pageindex;
    this.getData(++pageindex).then(res=>{
      let list = res.data.rows;

      this.setData({ 
            list: [...this.data.list, ...list], 
            isOver: list.length < this.data.pagesize, 
            pageindex, 
            loading:false
      })
    })
  }
})