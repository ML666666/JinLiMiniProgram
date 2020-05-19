// pages/me/page/Collection/Collection.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowTab:false,
    categoryLst:[],
    categoryId: 0,
    pageIndex: 1,
    pageSize: 8,
    list:[],
    isShowLoading:false,
    isOver:false,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true,
    isDelete:false
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  refresh(){
    this.isRefreshing()
    this.getList(1).then(res => {
      this.setData({
        list: [...res.data.list],
        isShowLoading: false,
        isOver: res.data.list.length < this.data.pageSize ? true : false,
        pageIndex:1
      })
      this.isRefreshing();
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    this.setData({ navHeight: app.globalData.navHeight});
    this.GetFavoriteCategory();
    this.getList().then(res=>{
      this.setData({
        list: [...this.data.list, ...res.data.list],
        isShowLoading: false,
        isOver: res.data.list.length < this.data.pageSize?true:false,
        isRenderingPage: !this.data.isRenderingPage
      })
      this.isRefreshing();
    })
  },
  isRefreshing(){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing
    })
  },
  showTab(){
    this.setData({ isShowTab: !this.data.isShowTab});
  },
  GetFavoriteCategory(){
    app.globalData.post('UserCenter/GetFavoriteCategory',{}).then(res=>{
      this.setData({ categoryLst:res.data.categoryLst});
    })
  },
  getList(pageIndex = this.data.pageIndex, categoryId=this.data.categoryId){
      let obj = {
        categoryId: categoryId,
        pageIndex: pageIndex,
        pageSize: this.data.pageSize
      }
      this.setData({ isShowLoading: true})
      return app.globalData.post('UserCenter/GetMyFavorite',obj)
  },
  reSetList(e){
    this.isRefreshing();
    let _this = this;
    // 如e.currentTarget.dataset.categoryid为-1则表示为全部
    let categoryId = e.currentTarget.dataset.categoryid ? 
                                    e.currentTarget.dataset.categoryid : 
                                                            _this.data.categoryId;
    this.setData({ 
      isOver:false,
      pageIndex:1,
      isShowLoading:false,
      categoryId: categoryId < 0 ? 0 : categoryId
      },()=>{
        this.getList().then(res=>{
          this.setData({
            list: [...res.data.list],
            isShowLoading: false,
            isOver: res.data.list.length < this.data.pageSize ? true : false,
            isShowTab: false
          })
          this.isRefreshing();
        });
    });
  },
  isDelete(){
    this.setData({ isDelete: !this.data.isDelete})
  },
  onReachBottom: function () {
    if(this.data.isOver){
      return
    }
    let pageIndex = this.data.pageIndex;
    this.getList(pageIndex++).then(res=>{
      this.setData({ pageIndex})
    });
  },

  toGoodDetail(e){
    wx.navigateTo({
      url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${e.currentTarget.dataset.productid}`,
    })
  },
  toDelete(e){
    let list = this.data.list;
    let favoriteID = e.currentTarget.dataset.favoriteid;
    let index = e.currentTarget.dataset.index;
    app.globalData.post('UserCenter/RemoveProductFavorite', { favoriteID}).then(res=>{
      if (res.data.success == 200){
        list.splice(index,1);
        this.setData({ list })
        app.globalData.toast(res.data.msg);
      }
    })
  }
})