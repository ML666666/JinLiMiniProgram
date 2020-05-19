const app = getApp();
Page({
  data: {
    index:0,//当前Active的index
    solitaireTopData:{},//频道信息
    CategoryId: 0,//商品类型id
    currentTop:0,//当前距离顶部高度

    isRenderingPage:true,//是否请求数据中
    isLoading:false,//是否正在加载
    refreshed:false,//是否Loading状态结束
    refreshing:true,//是否进入Loading
    
    isaboutme:0,//是否我的免单页面
    member:null,//用户信息

    allRow:[],//全部数据
    userInfoGetList:false,//触底时改变该变量来通知组件已到达底部，请重新加载更多数据
  
  },
  
  onLoad: function (options) {

    this.setData({ HigherlevelMemberId: options.HigherlevelMemberId});
    let isaboutme = options.isaboutme ? options.isaboutme : this.data.isaboutme;
    this.setData({isaboutme},()=>{
      if(isaboutme==0){
          this.getFreeOfChargeFristPageData().then(res=>{
            this.setData({ isRenderingPage: !this.data.isRenderingPage });
            this.isReFreshing();
            this.setAllRow(this.data.index, res[1].data.rows);
          })
      }else{
          this.getUserInfo().then(res=>{
              this.setUserInfo(res);
          })
      }
    })
  },
  getFreeOfChargeFristPageData(){
    let one = this.solitaireTopData();
    let two = this.getProductList();

    return Promise.all([one, two])
  },
  // 存储数据
  setAllRow(index, res, reLoad=false){
    return new Promise((resolve,reject)=>{
      let allRow = this.data.allRow;
      allRow[index] = {
        list: typeof (allRow[index]) == 'undefined' || reLoad ? [...res] : [...allRow[index].list,...res],
        pageindex: typeof(allRow[index]) == 'undefined' || reLoad ? 1 : allRow[index].pageindex+1,
        isOver:res.length<this.data.pagesize?true:false
      }
      this.setData({allRow});
      resolve(allRow);
    })
  },
  findAllRow(index){
    return typeof (this.data.allRow[index]) != 'undefined'
  },
  // 下拉加载更多
  onReachBottom: function () {
    // 如为列表页
    if (this.data.isaboutme == 0) {
      if (this.data.allRow[this.data.index].isOver){
        return
      }
      this.setData({ isLoading:true})
      let pageindex = this.data.allRow[this.data.index].pageindex;
      this.getProductList(++pageindex).then(res=>{
        this.setAllRow(this.data.index, res.data.rows);
        this.setData({ isLoading:false});
      })
    }else{
      this.setData({ userInfoGetList: !this.data.userInfoGetList});
    }
  },
  // 改变下拉状态
  isReFreshing(){
    this.setData({
      refreshed: !this.data.refreshed,//是否Loading状态结束
      refreshing: !this.data.refreshing,//是否进入Loading
    })
  },  
  // 改变Tabs ,判断该ActiveIndex对应的数组位置是否有缓存数据，如有读取缓存，如无则想后台请求
  changeTab(e){
    
    let index = e.detail.index;
    !this.findAllRow(index) ? this.isReFreshing() : null;
    this.findAllRow(index) ? this.setData({ index }):
    this.setData({index,CategoryId:e.detail.categoryid},()=>{
        this.getProductList().then(res=>{
          this.isReFreshing()
          this.setAllRow(index, res.data.rows);
        })
    })

  },
  // 下拉刷新
  refresh(){
    // 如为列表页
    if (this.data.isaboutme==0){
      let index = this.data.index;
      this.isReFreshing();
      this.getProductList().then(res=>{
        let one = this.solitaireTopData();
        let two = this.getProductList();
        Promise.all([one, two]).then(res => {
          this.isReFreshing();
          this.setAllRow(index, res[1].data.rows,true);
        })
      })
    }else{
      this.getUserInfo().then(res => {
        this.setUserInfo(res,false);
        this.isReFreshing();
      })
    }
  },
  // 监听滚动
  onPageScroll(e){
    this.setData({currentTop:e.scrollTop})
  },
  // 获取频道信息
  solitaireTopData(){
    return new Promise((resolve,reject)=>{
      app.globalData.post('solitaire/solitaireTopData', {}).then(res => {
          this.setData({ solitaireTopData:res.data});
          resolve(res.data);
      })
    })
  },
  // 切换页面
  changePage(e){
    let isaboutme = e.currentTarget.dataset.isaboutme;
    this.setData({ isaboutme: e.currentTarget.dataset.isaboutme });
  },
  // 获取商品列表信息
  getProductList(pageindex=1){
    // res.data.rows
    return new Promise((resolve,reject)=>{
      let obj = {
        CategoryId: this.data.CategoryId ? this.data.CategoryId:null,
        pageindex: pageindex,
        pagesize: this.data.pagesize
      }
      app.globalData.post('solitaire/getProductList',obj).then(res=>{
        resolve(res);
      })
    })

  },
  // 改变底部导航栏
  changeTabButtom(e){

    if(wx.getStorageInfoSync('userInfo').keys.indexOf('userInfo')<0 && e.detail.isaboutme==1){ //前往我的免单时判断是否已等录
      this.setData({ haveLoadfail: true });
      wx.navigateTo({
        url: '/pages/Login/Login',
      })
      return
    }else{
      this.setData({ isaboutme: e.detail.isaboutme }, () => {
        if (e.detail.isaboutme == 1 && this.data.member == null) {
          this.getUserInfo().then(res =>{
            this.setUserInfo(res);
            this.setData({isRenderingPage:!this.data.isRenderingPage});
            this.isReFreshing();
          })
        } else {
          if(this.findAllRow(0)){
            return
          }
          this.setData({ isRenderingPage: !this.data.isRenderingPage });
          this.isReFreshing();
          this.getFreeOfChargeFristPageData().then(res => {
            this.setData({ isRenderingPage: !this.data.isRenderingPage });
            this.isReFreshing();
            this.setAllRow(this.data.index, res[1].data.rows);
          })
        }
      })
    }
  },
  // 获取用户信息 
  getUserInfo() {
    return app.globalData.post("Solitaire/getMyUserInfo", {})
  },
  //存储用户信息
  setUserInfo(res,isRenderPage=true){
    isRenderPage?this.setData({ isRenderingPage: !this.data.isRenderingPage }):null;
    this.isReFreshing();
    if (res.data.success == 400) {
      this.setData({ haveLoadfail: true });
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/Login/Login',
        })
      }, 200)
    } else {
      this.setData({ member: res.data.member });
    }
  },
  onShow(){
    if (this.data.haveLoadfail){
      this.setData({ isaboutme: 1, haveLoadfail:false},()=>{
        this.getUserInfo().then(res => {
          this.setUserInfo(res);
          this.setData({ isRenderingPage: !this.data.isRenderingPage });
          this.isReFreshing();
        })
      });
    }
  },
  // 分享
  onShareAppMessage: function () {
    let shareObj = app.globalData.interceptShare(`pages/Active/FreeOfCharge/FreeOfCharge?isaboutme=${0}`,'免单接龙')
    return shareObj
  },
  toRule(){
    wx.navigateTo({
      url: '/pages/Active/FreeOfCharge/JLHtml/JLHtml',
    })
  }
})