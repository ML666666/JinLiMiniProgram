const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    orderid:null,
    obj:{},
    OrdersDiscountDetailJson:null,
    refreshing:true,
    refreshed:false,
    isRenderingPage:true,
    isSp:false, //是否双拼
    isJL:false //是否接龙
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ windowHeight: app.globalData.windowHeight});
    this.setData({ isJL: options.isJL ? true:false});
    this.setData({ orderid: options.orderid},()=>{
        this.getmyorderDetail().then(res=>{
          this.isRefreshing();
          this.GetPayType();
          this.setData({ obj:res.data.rows},()=>{
            // TwoPersonChip / GetShareInfo 
            // 如拼团未成功，则获取分享信息
            this.setData({ isSp: res.data.rows.TowGroup.list.length > 0 ? true : false })
            if (res.data.rows.TowGroup.list.length == 1){
              app.globalData.post('TwoPersonChip/GetShareInfo', { orderid: options.orderid}).then(res=>{
                this.setData({ Share: res.data.Share});
              })
            }
            if (res.data.rows.TowGroup.list.length == 2){
              let winner = res.data.rows.TowGroup.list.find((item) => { return item.WinStatus == 1 });
              this.setData({ winner })
            }
          })
          res.data.rows.OrdersDiscountDetailJson?
          this.setData({ OrdersDiscountDetailJson: JSON.parse(res.data.rows.OrdersDiscountDetailJson)}):null
          this.setData({
            isRenderingPage: !this.data.isRenderingPage
          })
        })      
    });
  },
  GetPayType() {
    return new Promise((resolve, reject) => {
      app.globalData.post('Paying/GetPayType', {}).then(res => {
        resolve(res)
        res.data.success == 200 ? this.setData({ payTypelist: res.data.list }) : app.globalData.toast(res.data.msg);
      })
    })
  },
  // 返回上一页
  reSetData(){
    // wx.navigateBack({})
    this.refresh();
  },
  // 获取订单详情
  getmyorderDetail(){
    let url = this.data.isJL ? 'Solitaire/getmyorderDetail' :'account/getmyorderDetail'
    return app.globalData.post(url, { orderid: this.data.orderid})
  },
  // 前往商品详情
  toGoodDetail(e){
    wx.navigateTo({
      url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${e.currentTarget.dataset.productid}`,
    })
  },
  getQuery(type,e){
    let s = null;
    switch(type){
      case 4:
        s = `?id=${e.currentTarget.dataset.productid}`
        break;
      case 3:
        s = `?id=${this.data.obj.LstProduct[0].ProductId}&goodtype=${this.data.obj.OrderStatus}`
        break
      case 2:
        s = ``
        break
    }
    return s;
  },
  // 改变下拉状态
  isRefreshing(){
    this.setData({
      refreshing: !this.data.refreshing,
      refreshed: !this.data.refreshed,
    })
  },
  refresh(){
    this.isRefreshing();
    this.getmyorderDetail().then(res => {
      this.GetPayType();
      this.setData({ obj: res.data.rows }, () => {
        // TwoPersonChip / GetShareInfo 
        // 如拼团未成功，则获取分享信息
        this.setData({ isSp: res.data.rows.TowGroup.list.length > 0 ? true : false })
        if (res.data.rows.TowGroup.list.length == 1) {
          app.globalData.post('TwoPersonChip/GetShareInfo', { orderid: options.orderid }).then(res => {
            this.setData({ Share: res.data.Share });
          })
        }
        if (res.data.rows.TowGroup.list.length == 2) {
          let winner = res.data.rows.TowGroup.list.find((item) => { return item.WinStatus == 1 });
          this.setData({ winner })
        }
      })
      res.data.rows.OrdersDiscountDetailJson ?
      this.setData({ OrdersDiscountDetailJson: JSON.parse(res.data.rows.OrdersDiscountDetailJson) }) : null;
      this.isRefreshing();
    })
  },
  // 退款
  getBackMoney(e){
    let orderid = e.currentTarget.dataset.orderid;
    let orderitemid = e.currentTarget.dataset.orderitemid;
    wx.navigateTo({
      url: `/pages/me/page/orderList/SalesReturnApplyFor/SalesReturnApplyFor?orderid=${orderid}&orderitemid=${orderitemid}`,
    })
  },
  // 分享
  onShareAppMessage: function () {
    let interceptObj = false;
    if (this.data.isSp){
      interceptObj = app.
        globalData.interceptShare(`pages/Active/LuckyDouble/page/LuckyDoubleShare/LuckyDoubleShare?TwoPersonChipNo=${this.data.Share.GroupNo}`,
          this.data.Share.Title,
          this.data.Share.Icon)
    }
    if (this.data.isJL){
      interceptObj = app.
        globalData.interceptShare(`pages/Active/LuckyDouble/page/LuckyDoubleShare/LuckyDoubleShare?TwoPersonChipNo=${this.data.Share.GroupNo}`,
          this.data.Share.Title,
          this.data.Share.Icon)
    }
    return interceptObj;
  }
})