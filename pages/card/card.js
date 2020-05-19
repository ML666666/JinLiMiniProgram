
const app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl
Page({
  data: {
    isLogin:true,
    userInfo:null,//用户信息
    cardData:{},//用户购物车信息
    total:null,//商品总金额
    isEdit:false,// 是否编辑状态
    refreshed:false,
    refreshing:true,
    isRenderingPage:true,
    windowHeight:null,

    cardUrl: baseUrl+'upload/Picture/comment/201910/41b007fccf274e65ade3f8a6a7ba3c11.png?v=1.0.41'
  },
  // onHide(){
  //   setTimeout(()=>{
  //     this.setData({ isRenderingPage: true });
  //     this.isRefreshing();
  //   },200)
  // },
  onLoad: function (){
    this.setData({ windowHeight: app.globalData.windowHeight});
    wx.getStorageSync('userInfo')?this.getList(true).then((res)=>{
      this.getTotalPrice(res.rows);
      this.setData({ isEdit:false});
      this.setData({ isLogin: true, isRenderingPage: false });
      this.isRefreshing();
    }):setTimeout(()=>{
        this.setData({ isLogin: false, isRenderingPage:false });
        this.isRefreshing();
    },200);
    this.setData({haveLoad:true});
  },
  onShow(){
    app.globalData.IsAngel().then(res => { this.setData({ IsAngel: wx.getStorageSync('IsAngel') }) })
    if (this.data.haveLoad){
      wx.getStorageSync('userInfo') ? this.getList(true).then((res) => {
        this.getTotalPrice(res.rows);
      }) : null
    }
  },
  toGoodDetail(e){
    if (this.data.isEdit){
      return
    }
    wx.navigateTo({
      url: '/pages/GeneralItemDescription/GeneralItemDescription?id=' + e.currentTarget.dataset.productid,
    })
  },
  isRefreshing(){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing,
    })
  },
  edit(){
    let isEdit = this.data.isEdit;
    this.setData({
      isEdit: !isEdit
    })
  },
  refresh(){
    this.isRefreshing();
    this.getList().then(res=>{
      this.isRefreshing();
      res.success == 400?setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/Login/Login',
        })
      },300):null
    })
  },
  // 获取购物车列表
  getList(IsCheckLogin=false){
    return new Promise((resolve,reject)=>{
      app.globalData.post('order/getshoppingcart', {}).then(res => {
         res.data.success == 200 ? this.setData({ cardData: res.data.rows },()=>{
           resolve(res.data);
           res.data.rows.length == 0 ? this.setData({ isEdit:false}):null;
           this.getTotalPrice();
         }) : null;
         if(res.data.success == 400 && IsCheckLogin)
         {
           wx.getStorageSync('userInfo') ?
            app.globalData.toast("登录超时，请下拉重新登录！") :
            app.globalData.toast("尚未登陆！");
           this.setData({ isLogin:false})
         }
         else{
           this.setData({ isLogin: true })
         };
         resolve(res.data);
      })
    })
  },
  toLogin(){
    wx.navigateTo({
      url: '/pages/Login/Login',
    })
  },
  /*
   *
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // 改变选中状态
  // 加减商品数量
  changeNum(e){
    let indexObj = e.target.dataset;
    let _cardData = this.data.cardData;
    let num = _cardData[indexObj.key].LstProduct[indexObj.li_key].BuyNum;
    let Id = _cardData[indexObj.key].LstProduct[indexObj.li_key].Id;
    let Stock = _cardData[indexObj.key].LstProduct[indexObj.li_key].Stock;
    if(indexObj.type){ //0为减
      if (!((num + 1) > Stock)) {
        _cardData[indexObj.key].LstProduct[indexObj.li_key].BuyNum++;
        num++;
      }else{
        app.globalData.toast('已达到库存上限！');
      }
    }else{
      if (num > 1) {
        _cardData[indexObj.key].LstProduct[indexObj.li_key].BuyNum--;
        num--;
      }else{
        let _this = this
        wx.showModal({
          title: '提示',
          content: '是否删除该商品？',
          success(res) {
            if (res.confirm) {
              _this.dalete(Id);
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return
      }
    }
    let obj = {
      itemid:Id,
      num
    }
    app.globalData.post('order/changeshoppingcart',obj).then(res=>{
      res.data.success == 200?this.setData({
        cardData: _cardData
      },()=>{
        this.getTotalPrice();
      }):null
    })

    //  _cardData[indexObj.key].LstProduct[indexObj.li_key]
  },
  //删除商品
  dalete(id){
    let post = app.globalData.post('order/delshoppingcart', { Id: id}).then(res=>{
      res.data.success == 200?this.getList():app.globalData.toast(res.data.msg);
    })
  },
  //是否删除购物车
  isDelete(e){
    console.log(e);
    let indexObj = e.currentTarget.dataset;
    let _this  = this;
    wx.showModal({
      title: '提示',
      content: '是否删除该商品？',
      success(res) {
        if (res.confirm) {
          _this.dalete(indexObj.id);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //改变是否选中的状态
  onChange(e){
    let indexObj = e.target.dataset;
    let _cardData = this.data.cardData;
    _cardData[indexObj.key].LstProduct[indexObj.li_key].IsCheck = !_cardData[indexObj.key].LstProduct[indexObj.li_key].IsCheck;
    app.globalData.post('order/checkshoppingcart',{
      Id: indexObj.id,
      Ischeck: _cardData[indexObj.key].LstProduct[indexObj.li_key].IsCheck
    }).then(res=>{
      res.data.success == 200 ? 
      this.setData({ cardData: _cardData }, () => { this.getTotalPrice() }) :
      app.globalData.toast(res.data,msg)
    })
  },
  // 获取总价
  getTotalPrice(Rows = this.data.cardData){
    let total = 0;
    let SalePriceTotal = 0;
    let discount = 0;
    for (let k in Rows){
      for (let i in Rows[k].LstProduct){
        let item = Rows[k].LstProduct[i];
        if (item.IsCheck){
          total += item.BuyNum * item.MemberPrice;
          SalePriceTotal += item.BuyNum *  item.SalePrice;
          discount = SalePriceTotal - total;
        }
      }
    }
    this.setData({ total: total.toFixed(2), SalePriceTotal: SalePriceTotal.toFixed(2), discount: discount.toFixed(2)});
  },

  onPullDownRefresh: function () {
    this.getList().then(res=>{
       wx.stopPullDownRefresh();
       res.success==400?wx.navigateTo({
         url: '/pages/Login/Login',
       }):null

    });
  },
  

  toTypeList(){
    wx.switchTab({
      url: app.globalData.MainPageUrl,
    })
  },

  makesureBuy() {
    if (this.data.total == '0.00'){
      app.globalData.toast("请先选择商品。");
      return
    }
    wx.getStorageSync('userInfo') ?
      app.globalData.post('order/getorderconfirm_v2', { orderType: 0 }).then(res => {
        res.data.success == 200?wx.navigateTo({
          url: '/pages/makeSureOrder/makeSureOrder',
        }) : app.globalData.toast(res.data.msg);
      }):
      app.globalData.toast("尚未登陆，请下拉重新登录！");
  }

})