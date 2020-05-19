const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TwoPersonChipTopData:{},
    CategoryId: 0,//商品类型id
    pagesize: 8,
    allrows:[],//全部List数据
    currentIndex:0,//当前ActiveIndex
    currentRows:[],//当前List数据
    currentTop: 0,//当前距离顶部高度
    isRenderingPage: true,//是否请求数据中
    isOver: false,//数据是否已全部加载完毕
    isLoading: false,//是否正在加载
    refreshed: false,//是否Loading状态结束
    refreshing: true,//是否进入Loading
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    let index = this.data.currentIndex;
    let one = this.TwoPersonChipTopData();
    let two = this.getProductList();
    Promise.all([one, two]).then(res => {
      this.setAllrows(index, res[1]).then(res => {this.setData({ currentRows: res }) });
      this.setData({ isRenderingPage: !this.data.isRenderingPage });
      this.isReFreshing();
    })
  },
  //下拉刷新
  refresh() {
    let one = this.TwoPersonChipTopData();
    this.isReFreshing();
    let allrows = this.data.allrows;
    let currentIndex = this.data.currentIndex;
    let currentRows = this.data.allrows[this.data.currentIndex];
    this.getProductList().then(res=>{
      Promise.all([one,this.setAllrows(currentIndex, res, true)]).then(res=>{
        this.setData({
          currentRows: this.data.allrows[this.data.currentIndex]
        });
        this.isReFreshing();
      })
    })
  },
  //上拉加载更多
  onReachBottom: function () {
    let allrows = this.data.allrows;
    let currentIndex = this.data.currentIndex;
    let currentRows = this.data.allrows[this.data.currentIndex];
    let pageindex = currentRows.pageindex;
    this.setData({ isLoading:true});
    this.getProductList(++pageindex).then(res=>{
      this.setAllrows(currentIndex, res).then(res => { 
        this.setData({ 
          currentRows:this.data.allrows[this.data.currentIndex] 
        });
        this.setData({ isLoading: false });
      });
    });
  },
  isReFreshing() {
    this.setData({
      refreshed: !this.data.refreshed,//是否Loading状态结束
      refreshing: !this.data.refreshing,//是否进入Loading
    })
  }, 
  //获取数据
  TwoPersonChipTopData(){
    return new Promise((resolve,reject)=>{
      app.globalData.post('TwoPersonChip/TwoPersonChipTopData',{}).then(res=>{
        resolve(res.data);
        this.setData({TwoPersonChipTopData:res.data});
      })
    })
  },
  // 改变Tabs
  changeTab(e) {
    let index = e.detail.index;//当前点击的TabIndex
    let key = e.detail.categoryid;//当前点击的Tabs对应的categoryid
    let currentRows = this.data.allrows[index];//获取对应index对应的数据
    this.setData({ currentIndex:index});
    if (!this.findAllrows(index)){//如已有缓存数据，则读取缓存数据
      this.setData({ currentRows });//读取缓存
      return
    }else{
      //加载数据
      this.isReFreshing();//设置Loading
      this.setData({CategoryId: e.detail.categoryid}, () => {
          this.getProductList().then(res =>{
              this.setAllrows(index, res).then(res=>{this.setData({ currentRows: res })});
              this.isReFreshing();//取消Loading
          });
      }) 
    }
  },
  // 搜索缓存数据
  findAllrows(index){
    return typeof (this.data.allrows[index]) == 'undefined';
  },
  //缓存列表数据
  setAllrows(index,res,reLoad=false){
    return new Promise((resolve,reject)=>{
      let allrows = this.data.allrows;
      allrows[index] = {
        rows: typeof (allrows[index]) == 'undefined' || reLoad ?
          [...res.data.rows] :
          [...allrows[index].rows, ...res.data.rows],
        pageindex: typeof (allrows[index]) == 'undefined' || reLoad ? 1 : allrows[index].pageindex+1,
        isOver: res.data.rows.length<this.data.pagesize?true:false
      }
      this.setData({
        allrows
      }, resolve(allrows[index]))
    })
  },
  // 监听滚动
  onPageScroll(e) {
    this.setData({ currentTop: e.scrollTop })
  },
  // 获取商品列表信息
  getProductList(pageindex=1) {
    return new Promise((resolve, reject) => {
      let obj = {
        CategoryId: this.data.CategoryId ? this.data.CategoryId : 0,
        pageindex: pageindex,
        pagesize: this.data.pagesize
      }
      app.globalData.post('TwoPersonChip/GetProductList', obj).then(res => {
        resolve(res);
      })
    })
  },
  onShareAppMessage: function () {
    let shareObj = app.globalData.interceptShare()
    return shareObj
  },
  toGoodDetail(e) {
    let id = e.currentTarget.dataset.id
    let goodtype = e.currentTarget.dataset.goodtype;
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${id}&goodtype=${goodtype}`,
    })
  }
})