const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data:{
    topData:null,
    activeIndex:null,
    listWrapper:[],
    index:0,
    pagesize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let listWrapper = this.data.listWrapper;
    let topData = app.globalData.post('Articles/TopData',{});
    Promise.all([topData]).then(res=>{
      this.setData({ topData:res[0].data })
      this.setData({ activeIndex: res[0].data.types[0].type})
      for (let v in this.data.topData.types){
        listWrapper.push({
          type:this.data.topData.types[v].type,
          pageindex: 1,
          list:[],
          isOver:false
        })
      }
      this.setData({ listWrapper },()=>{
        this.getList().then(res => {
          this.setListWrapper(0, res.data.rows);
        })
      })
    })
  },
  changeTabs(e){
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    this.setData({ activeIndex: type, index},()=>{
      let listWrapper = this.data.listWrapper[this.data.index];
      if(listWrapper.list.length || listWrapper.isOver){
        return;
      }
      this.getList(index, 1).then(res => {
        this.setListWrapper(this.data.index, res.data.rows)
      })
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  getList(type = this.data.activeIndex, pageindex=1){
    return app.globalData.post('Articles/GetList', { type, pageindex, pagesize: this.data.pagesize})
  },

  setListWrapper(index=0,list){
    let listWrapper = this.data.listWrapper;
    listWrapper[index].list = listWrapper[index].list.length ? [...listWrapper[index].list,...list]:[...list];
    listWrapper[index].pageindex = listWrapper[index].pageindex+1;
    listWrapper[index].isOver = list.length<this.data.pagesize?true:false;
    this.setData({listWrapper});
  },
  onReachBottom: function () {
    let listWrapper = this.data.listWrapper;
    let pageindex = listWrapper[this.data.index].pageindex;
    if (listWrapper[this.data.index].isOver){
      return
    }
    this.setData({ loading: true })
    this.getList(this.data.activeIndex, pageindex).then(res=>{
      this.setListWrapper(this.data.index, res.data.rows);
      this.setData({ loading: false })
    })
  },
  toDetail(e){

    wx.navigateTo({
      url: '/pages/me/page/AngelDetail/page/MaterialCircle/MaterialCircleArticle/MaterialCircleArticle?id=' + e.currentTarget.dataset.id,
    })
  }
})