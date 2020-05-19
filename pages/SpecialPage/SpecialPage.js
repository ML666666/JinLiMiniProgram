const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageindex:1,
    pagesize:10,
    sort:0,
    sortDirection:false,
    SpecialObj:{},
    isOver:false,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true,
    isShowData:true,
    timer:null,
    CustomTitle:"",
    CustomText:"",
    ImgSrc:"",
    activeMaks:false,
    windowHeight: app.globalData.windowHeight,
    navHeight: app.globalData.navHeight,
    ActiveId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  shareWrapper(){
    this.setData({ activeMaks:true });
  },
  hide(){
    this.setData({ activeMaks:false });
  },
  onLoad: function (options) {
    this.setData({ fromSearch: options.fromSearch });
    this.setData({ name: options.name });//看是否有来自其他页面的自定义头部
    this.setData({ fromMS: options.fromMS}); //是否来自秒杀
    this.setData({ SpecialAreaId: options.SpecialAreaId, ActiveId: options.ActiveId},()=>{
      let _this = this;
      this.GetSpecialAreaProduct().then(res=>{
        if(res.data.success!=200){
          this.isRefreshing(true);
          app.globalData.toast(res.data.msg);
        }
        this.setData({ SpecialObj:res.data},()=>{
          let SpecialObj = this.data.SpecialObj;
          let end_time = Date.parse(SpecialObj.EndTime); //非秒杀时采用该时间戳
          let start_time = SpecialObj.StartTime;
          this.setData({ CustomTitle: SpecialObj.Name });
          this.setData({ CustomText: SpecialObj.Intro });
          this.setData({ ImgSrc: SpecialObj.ImgSrc });
          let fromMS = this.data.fromMS;
          if ((Date.parse(new Date()) < Date.parse(end_time) &&
               Date.parse(new Date()) > Date.parse(start_time)) || fromMS) {
            this.setData({ isShowData: true })
            let CountDownTimestamp = fromMS ? fromMS : (Date.parse(end_time) - Date.parse(new Date())) / 1000
            this.setData({ CountDownTimestamp },()=>{
              this.CountDown();
              this.data.timer = setInterval(() => {
                this.CountDown();
              }, 1000)
            })
          }else{
            this.setData({isShowData:false })
          }
        });
        this.setData({ isOver: res.data.Pro.length < this.data.pagesize });
        this.isRefreshing(true)

        
        setTimeout(()=>{
          var query = wx.createSelectorQuery();
          query.select('#brand-tabbar').boundingClientRect()
          query.exec(function (res) {
            _this.setData({ commentTop: res[0].top });
          })
        },200);

      })
    })
  },
  onUnload(){
    clearInterval(this.data.timer);
  },
  CountDown(EndTime = this.data.CountDownTimestamp){
    let Days = parseInt(EndTime / 1000 / 60 / 60 / 24, 10); //计算剩天
    let Hours = parseInt(EndTime / 60 / 60 % 24, 10); //计算剩余的小时
    let Minutes = parseInt(EndTime / 60 % 60, 10); //计算剩余的分钟
    let Seconds = parseInt(EndTime % 60, 10); //计算剩余的秒数
    EndTime = (EndTime-1)==0?0:EndTime-1;
    this.setData({ Days, Hours, Minutes, Seconds, CountDownTimestamp: EndTime})
  },
  input(e){
    let obj = {};
    obj[e.target.dataset.name] = e.detail.value;
    this.setData(obj);
  },
  GetSpecialAreaProduct(){
    let obj = {
      pageindex: this.data.pageindex,
      pagesize: this.data.pagesize,
      sort: this.data.sort,
      sortDirection: this.data.sortDirection?1:0,
      gwb: this.data.gwb?this.data.gwb:''
    }
    if(this.data.ActiveId){
      obj.ActivityIdLst = this.data.ActiveId;
    }else{
      obj.SpecialAreaId = this.data.SpecialAreaId;
      obj.SpecialAreaIdLst = this.data.SpecialAreaId;
    }
    let POSTURL = this.data.ActiveId ? 'Special/GetProductActivity' :'Special/GetSpecialAreaProduct';
    return app.globalData.post(POSTURL, obj);
  },
  // tap(e){
  //   let sort = e.currentTarget.dataset.sort;
  //   this.data.sort == sort && (sort == 2 || sort==3) ? 
  //     this.setData({ sortDirection: !this.data.sortDirection }) : 
  //     this.setData({ sortDirection: false })
  //   this.setData({ sort },()=>{
  //     this.GetSpecialAreaProduct().then(res=>{
  //       this.setData({ SpecialObj: res.data });
  //     })
  //   })
  // },
  getStatus(e){
    this.setData(e.detail,()=>{
        this.GetSpecialAreaProduct().then(res=>{
          this.setData({ SpecialObj: res.data });
        })
    })
  },
  toDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/GeneralItemDescription/GeneralItemDescription?id='+id,
    })
  },
  onReachBottom: function () {
    if (this.data.isOver){
      return
    }
    let SpecialObj = this.data.SpecialObj;
    let pageindex = this.data.pageindex;
    this.setData({ pageindex: pageindex+1},()=>{
      this.GetSpecialAreaProduct().then(res => {
        SpecialObj.Pro = [...SpecialObj.Pro, ...res.data.Pro];
        this.setData({ isOver: res.data.Pro.length < this.data.pagesize });
        this.setData({ SpecialObj })
      })
    })
  },
  isRefreshing(isRenderingPage=false){
    this.setData({ refreshed: !this.data.refreshed });
    this.setData({ refreshing: !this.data.refreshing });
    isRenderingPage?this.setData({ isRenderingPage: !this.data.isRenderingPage }):null;
  },
  refresh(){
    this.isRefreshing();
    this.setData({ pageindex:1},()=>{
      this.GetSpecialAreaProduct().then(res => {
        this.setData({ SpecialObj: res.data });
        this.setData({ isOver: res.data.Pro.length < this.data.pagesize });
        this.isRefreshing();
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onPageScroll: function (e) {
    this.setData({ activeTop: e.scrollTop > this.data.commentTop })
  },
  onShareAppMessage: function () {
    let shareObj = app.globalData.interceptShare(false, this.data.CustomTitle, null, this.data.CustomText,true)
    return shareObj
  }
})