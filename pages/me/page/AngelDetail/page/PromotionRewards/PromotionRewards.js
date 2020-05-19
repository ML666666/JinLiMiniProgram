const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,
    listWrapper:[
      {
        pageindex: 1,
        lst:[],
        isOver:false
      },
      {
        pageindex: 1,
        lst:[],
        isOver:false
      }
    ],
    totalReward:0,
    totalsNum:0,
    pagesize:8,
    loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getData(0).then((res)=>{
      this.setData({
        totalReward: res.data.totalReward,
        totalsNum: res.data.totalsNum,
      })
      this.setIistWrapper(res);
    })
  },
  setIistWrapper(res){
    let listWrapper = this.data.listWrapper
    listWrapper[this.data.type].lst = listWrapper[this.data.type].lst.length ? 
                                                 [...res.data.lst,...listWrapper[this.data.type].lst]:
                                                                                                res.data.lst;
    listWrapper[this.data.type].isOver = res.data.lst.length < this.data.pagesize ? true : false;
    this.setData({ listWrapper })
  },
  getData(type = 0, pagesize=1){
    return app.globalData.post('Activity/GetLsLiBaoReward',{
      pageindex: pagesize,
      pagesize: this.data.pagesize,
      type
    })
  },
  onReachBottom: function (){
    this.setData({loading:true});
    let listWrapper = this.data.listWrapper;
    let pageindex = listWrapper[this.data.type].pageindex;
    if (listWrapper[this.data.type].isOver){
      return
    }
    this.getData(this.data.type, ++pageindex).then(res=>{
      this.setIistWrapper(res);
      listWrapper[this.data.type].pageindex = pageindex;
      this.setData({ loading: true, listWrapper });
    })
  },
  changeTab(e){
    let type = e.currentTarget.dataset.type;
    this.setData({ type },()=>{
      if(type==1 && this.data.listWrapper[1].lst.length==0){
        this.getData(type).then(res=>{
          this.setData({totalReward: res.data.totalReward})
          this.setIistWrapper(res)
        })
      }
    });
  },
  toQuestion(){
    wx.navigateTo({
      url: `/pages/me/page/AngelDetail/page/HtmlApp/HtmlApp?Good_id=tuijianyoujiangUrl`,
    })
  },
  toGetRewards(){
    wx.navigateTo({
      url: '/pages/me/page/RemainingSum/getBalance/getBalance',
    })
  } 
})