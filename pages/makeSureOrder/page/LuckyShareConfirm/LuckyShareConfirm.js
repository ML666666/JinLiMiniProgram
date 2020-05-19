const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows:[],
    Share:{},
    refreshed:false,
    refreshing:true,
    isRenderingPage:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      OrderIdList: options.OrderIdList,
      ProductId: options.ProductId
    },()=>{
      Promise.all([this.GetProductList(),this.GetShareInfo()]).then(res=>{
        this.setData({
          rows:res[0].data.rows,
          Share:res[1].data.Share
        })
        this.isRefreshing();
        this.setData({ isRenderingPage: !this.data.isRenderingPage});
      })
    })
  },
  isRefreshing(){
    this.setData({ refreshed: !this.data.refreshed, refreshing: !this.data.refreshing})
  },
  refresh(){
    this.isRefreshing();
    this.isRefreshing();
  },
  // 获取相关商品
  GetProductList(){
    let obj = {
      id: this.data.OrderIdList,
      pageindex: 1,
      pagesize: 8
    }
    return app.globalData.post('TwoPersonChip/GetProductList', obj)
  },
  // 获取分享信息
  GetShareInfo(){
    let obj = {
      orderid: this.data.OrderIdList
    }
    return app.globalData.post('TwoPersonChip/GetShareInfo', obj)
  },
  // 跳转到详情页
  toDetail(e){
    let id = e.currentTarget.dataset.id;
    let goodtype = e.currentTarget.dataset.goodtype; //goodType = 2 为幸运双拼的商品
    wx.navigateTo({
      url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${id}&goodtype=${goodtype}`,
    })
  },
  // 微信分享
  // 分享
  onShareAppMessage: function (){
    return app.globalData.interceptShare(`pages/Active/LuckyDouble/page/LuckyDoubleShare/LuckyDoubleShare?TwoPersonChipNo=${this.data.Share.GroupNo}`, this.data.Share.Title, this.data.Share.Icon)
    // return {
    //   title: this.data.Share.Title,
    //   imageUrl: this.data.Share.Icon,
    //   path: `pages/Active/LuckyDouble/page/LuckyDoubleShare/LuckyDoubleShare?TwoPersonChipNo=${this.data.Share.GroupNo}`
    // }
  },

})