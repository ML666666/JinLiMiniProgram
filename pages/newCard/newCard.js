const app = getApp();
const baseUrl = app.globalData.gob.config.baseUrl.indexOf('https')>0 ? app.globalData.gob.config._baseUrl : app.globalData.gob.config.baseUrl
let CardObj = {

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: app.globalData.windowHeight,
    isReactBottom: 1,
    refreshed: false,
    refreshing: true,
    isRenderingPage:true,
    haveLoad: false,
    AllCheck: 0,
    cardData: [],
    ShoppingCartExpireGoods: [],
    isSeletAll: false,
    isShow: false,
    PID: null,
    BuyNum: null,
    CardId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  hide() {
    this.setData({ isShow: false })
  },
  onLoad: function (options) {
    this.setData({ orderid: options.orderid })
    this.setData({ isPaySuccess: options.isPaySuccess ? options.isPaySuccess:false})
    wx.getStorageSync('userInfo') ? this.getAllList().then((res) => {
      this.setData({ isLogin: true, isRenderingPage: false });
      this.isRefreshing();
      this.setData({ haveLoad: res[1].success == 400 }, () => { res[1].success == 400?wx.navigateTo({ url: '/pages/Login/Login' }):null })
    }) : setTimeout(() => {
      wx.navigateTo({url: '/pages/Login/Login'});
      this.setData({ isLogin: false, haveLoad:true,isRenderingPage: false });
      this.isRefreshing();
    }, 100);
  },
  onShow() {
    if (this.data.haveLoad) {
      wx.getStorageSync('userInfo') ? this.getAllList() : null
    }
  },
  toDetail(e) {
    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/GeneralItemDescription/GeneralItemDescription?id=' + id,
    })
  },
  // 下拉刷新
  refresh() {
    this.isRefreshing();
    this.getAllList().then(res => {
      this.isRefreshing();
      console.log(res)
      res[1].success == 400 ? setTimeout(() => {
        wx.navigateTo({
          url: '/pages/Login/Login',
        })
      }, 300) : null
    })
  },
  getAllList() {
    return Promise.all([this.GetShoppingCartExpireGoods(), this.getList()])
  },
  //获取过期商品列表
  GetShoppingCartExpireGoods() {
    return new Promise((resolve, reject) => {
      app.globalData.post('Order/GetShoppingCartExpireGoods', {}).then(res => {
        if (res.data.success == 200){
          this.setData({
            ShoppingCartExpireGoods: res.data.data.map(item => {
              if (item.ProductImg) {
                item.ProductImg =  item.ProductImg;
              }
              return item;
            })
          })
        }
        resolve(res.data);
      })
    })
  },
  // 获取购物车列表
  getList(IsCheckLogin = false) {
    return new Promise((resolve, reject) => {
      app.globalData.post('order/getshoppingcart', {}).then(res => {
        res.data.success == 200 ? this.setData({ cardData: this.getTotalPrice(res.data.rows) }, () => {
          this.setData({ timestamp: res.data.seconds });
          resolve(res.data);
        }) : null;
        if (res.data.success == 400 && IsCheckLogin) {
          wx.getStorageSync('userInfo') ?
            app.globalData.toast("登录超时，请下拉重新登录！") :
            app.globalData.toast("尚未登陆！");
          this.setData({ isLogin: false })
        } else {
          this.setData({ isLogin: true })
        };
        resolve(res.data);
      })
    })
  },
  getTotalPrice(cardData = this.data.cardData) {
    let AllCheck = 0;
    let AllGOODPRICE = 0;
    let isSeletAll = false;
    let goodNum = 0;
    let seletGoodNum = 0;
    for (let v in cardData) {
      let num = 0;
      for (let w in cardData[v].LstProduct) {
        goodNum++;
        if (cardData[v].LstProduct[w].IsCheck) {
          seletGoodNum++;
          num++;
          AllGOODPRICE = AllGOODPRICE + cardData[v].LstProduct[w].BuyNum * cardData[v].LstProduct[w].SalePrice
        }
        cardData[v].isAllCheck = (num == cardData[v].LstProduct.length);
      }
      AllCheck = AllCheck + num;
    }
    this.setData({ AllCheck, AllGOODPRICE: AllGOODPRICE.toFixed(2), isSeletAll: (goodNum == seletGoodNum) && seletGoodNum > 0 });
    return cardData
  },
  isRefreshing() {
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing,
    })
  },
  //是否选择
  changeStatus(e) {
    app.globalData.post('order/checkshoppingcart', {
      Id: e.currentTarget.dataset.id,
      Ischeck: !e.currentTarget.dataset.ischeck
    }).then(res => {
      this.getList()
    })
  },
  //是否改变数量
  onChangeNum(e) {
    let id = e.currentTarget.dataset.id;
    let obj = {
      itemid: id,
      num: e.detail
    }
    app.globalData.post('order/changeshoppingcart', obj).then(res => {
      res.data.success == 200 ? this.getList() : null
    })
  },
  toDelete(e){
    let id = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : e.detail.dataset.id;
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '是否删除该商品？',
      success(res) {
        if(res.confirm) {
          app.globalData.post('order/delshoppingcart', { Id: id }).then(res => {
            res.data.success == 200 ? _this.refresh() : app.globalData.toast(res.data.msg);
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //收藏方法开始
  isLogin() {
    if (wx.getStorageSync('userInfo')) {
      return wx.getStorageSync('userInfo')
    } else {
      wx.showModal({
        title: "提示",
        content: '未登录，是否前往登录页',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/Login/Login' })
          }
        }
      })
      return false;
    }
  },
  AddProductFavorite(e) {
    if (this.isLogin()) {
      let _this = this;
      let id = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : e.detail.dataset.id;
      app.globalData.post('UserCenter/AddProductFavorite', { productId: e.currentTarget.dataset.productid }).then(res => {
        if (res.data.success == 200) {
          app.globalData.toast(res.data.msg);
          app.globalData.post('order/delshoppingcart', { Id: id }).then(res => {
            res.data.success == 200 ? _this.refresh() : app.globalData.toast(res.data.msg);
          })
          this.setData({ FavoriteID: res.data.favoriteId })
        } else {
          wx.showModal({
            title: "提示",
            content: res.data.msg,
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({ url: '/pages/Login/Login' })
              }
            }
          })
        }
      })
    }
  },
  //收藏方法结束

  //选择该组所有商品
  isCheckAllGround(e) {
    let Id = '';
    let index = e.currentTarget.dataset.index;
    let ischeck = e.currentTarget.dataset.ischeck;
    for (let v in this.data.cardData[index].LstProduct) {
      Id = Id + `,${this.data.cardData[index].LstProduct[v].Id}`
    }
    app.globalData.post('order/checkshoppingcart', {
      Id: Id.substring(1),
      Ischeck: !ischeck
    }).then(res => {
      this.getList()
    })

  },
  //全选
  isCheckAll() {
    let Id = '';
    for (let v in this.data.cardData) {
      for (let k in this.data.cardData[v].LstProduct) {
        Id = Id + `,${this.data.cardData[v].LstProduct[k].Id}`
      }
    }
    app.globalData.post('order/checkshoppingcart', {
      Id: Id.substring(1),
      Ischeck: !this.data.isSeletAll
    }).then(res => {
      this.getList()
    })
  },
  makesureBuy() {
    if (this.data.isPaySuccess){
      return
    }
    if (this.data.AllCheck == 0) {
      app.globalData.toast("请先选择商品。");
      return
    }
    wx.getStorageSync('userInfo') ?
      app.globalData.post('order/getorderconfirm_v2', { orderType: 0 }).then(res => {
        res.data.success == 200 ? wx.navigateTo({
          url: '/pages/makeSureOrder/makeSureOrder?isFromCard=true',
        }) : app.globalData.toast(res.data.msg);
      }) :
      app.globalData.toast("尚未登陆，请下拉重新登录！");
  },
  toChangeAttr(e) {
    console.log(e);
    this.setData({ isShow: true, PID: e.currentTarget.dataset.id, BuyNum: e.currentTarget.dataset.buynum, CardId: e.currentTarget.dataset.cardid })
  },
  //触底触发该方法
  onReachBottom() {
    this.setData({ isReactBottom: this.data.isReactBottom + 1 })
  },
}
export default CardObj;
Page(CardObj)