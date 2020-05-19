// pages/makeSureOrder/makeSureOrder.js
let app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wx_Url: baseUrl + 'upload/Picture/comment/201911/7cf0063754f14392affacaf7276594f9.png?v=1.0.41',
    zf_Url: baseUrl + 'upload/Picture/comment/201911/a1d4c0b532b1435c93387ca6d3d4db05.png?v=1.0.41',
    orderObj: null,//订单详情对象
    getaddress: null,//获取地址信息
    windowHeight: 568,//手机物理宽度
    payTypeList: [],//支付类型数组
    payIndex: 0,//支付类型对应的Index
    paytype: null,//支付类型
    ProductType: null,
    OrderObj: null,//获取订单对象
    toPayByBalance: true,//是否用余额支付
    isShowBuyMask: false,//是否展示确认下单的确认框
    isBuying: false,//是否正在支付中
    refreshed: false,//加载结束
    refreshing: true,//加载中
    isRenderingPage: true,//是否渲染成功
    payOnlyByGwb: false,//是否只允许购物币支付
    remark: "{}", //评论
    haveLoadData:false,
    isBindPhone: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    if (!this.data.haveLoadData){
      this.renderOrderData();
      this.getaddress();
    }
  },

  onLoad: function (options) {
    // ProductType == 0 为普通商品
    // ProductType == 1 为幸运双拼
    // ProductType == 2 为免单接龙
    // ProductType == 3 为幸运双拼
    this.setData({ ActivityInfoType: options.ActivityInfoType}) //活动类型
    this.setData({ GoodId: options.GoodId }); //商品ID
    this.setData({ isFromDtActive: options.isFromDtActive }); //是否来自活动

    this.setData({ isFromCard: options.isFromCard })
    this.setData({ windowHeight: app.globalData.windowHeight })
    this.setData({ ProductType: options.ProductType ? options.ProductType : 0 }) 
    this.setData({ GroupNo: options.GroupNo ? options.GroupNo : null })  // GroupNo 幸运双拼的团拼号
    this.renderOrderData().then(()=>{ 
      this.isRefreshing(true);
      this.setData({ haveLoadData: true })
      this.renderStatus();
      this.setData({ OfflinePack: this.data.ProductObj.OfflinePack });
    }); 
  },
  renderStatus(){
    let orderObj = this.data.orderObj;
    orderObj.DefaultAddress =
         orderObj.DefaultAddress ?
              orderObj.DefaultAddress : 
                  this.data.getaddress.rows.length?
                      this.data.getaddress.rows[0]:null
    this.setData({ orderObj });
    if (this.data.payTypeList.length == 1 && this.data.ProductType == 2) {
      this.setData({ payOnlyByGwb: true });
    } else {
      this.setData({ payOnlyByGwb: false });
    }
  },
  renderOrderData(){
    return Promise.all([this.getorderconfirm(), this.getaddress(), this.GetPlayType(), this.isBindPhone()])
  },  
  isBindPhone() {
    return app.globalData.post('UserCenter/IsBingPhone', {}).then(res => {
      if (res.data.success == 401 || res.data.success == 402) {
        this.setData({ isBindPhone: true })
        return
      }
    })
  },
  isRefreshing(isRenderingPage=false){
    this.setData({ refreshed: !this.data.refreshed, refreshing: !this.data.refreshing });
    isRenderingPage ? this.setData({ isRenderingPage: !this.data.isRenderingPage}):null
  },
  // 获取订单信息
  refresh(){
    this.isRefreshing();
    this.renderOrderData().then(() => {
      this.renderStatus();
      this.isRefreshing();
    }); 
  },
  // 支付方法
  reSetBuy(e) {
    this.setData({ isBindPhone: false }, () => {
      // if (e.detail.isReSet) {
      //   this.buy();
      // }
    })
  },
  getorderconfirm(isChangeAddress = false, packs=null){
    
    return new Promise((resolve,reject)=>{
      // ProductType == 0 为普通商品
      // ProductType == 1 为幸运双拼
      // ProductType == 2 为免单接龙
      // ProductType == 3 为幸运双拼
      let addressid = isChangeAddress ? (this.data.orderObj.DefaultAddress.Id || this.data.orderObj.DefaultAddress.AddressId) : null
      let URL = this.data.ProductType == 2 ? 'order/getorderJLconfirm' : 'order/getorderconfirm_v2'
      if (this.data.ActivityInfoType == 9 || this.data.ActivityInfoType==10){
        URL = 'order/ActivityOrderConfirm'
      }
      let obj = { orderType: this.data.ProductType, 
                  addressid, productid: this.data.GoodId,
                  offlinePack: this.data.OfflinePack?"0":"1" };
      isChangeAddress ? obj['offlinePack'] = "0":null;
      try {
        if ('useDeduction' in this.data.orderObj) {
          obj['useDeduction'] = this.data.toPayByBalance
        }
      } catch (e) {
        console.log('frist getData')
      }
      let post = app.globalData.post(URL, obj);
      post.then(res =>{
        // res.data.DiscountAmount = res.data.DiscountAmount?res.data.DiscountAmount.toFixed(2):0;
        // res.data.ExpressAmount = res.data.ExpressAmount.toFixed(2);
        // res.data.DeductionBalanceLimit = res.data.DeductionBalanceLimit?res.data.DeductionBalanceLimit.toFixed(2):0;
        this.setData({ ProductObj: res.data.data.Product});
        this.setData({ orderObj: res.data.data });
        this.setData({ OfflinePack: this.data.ProductObj.OfflinePack });
        resolve(res);
      })
    })
  },
  changePick(){
    // let p = this.data.OfflinePack == 1 ?0:1;
    // this.setData({ OfflinePack:p })
    this.getorderconfirm(false)
  },
  // 获取地址
  getaddress(){
    return new Promise((resolve, reject) => {
      let post = app.globalData.post('order/getaddress',{});
      post.then(res => {
        this.setData({ getaddress: res.data })
        resolve(res);
      })
    })
  },
  onChange(){
    let toPayByBalance = !this.data.toPayByBalance;
    this.setData({
      toPayByBalance
    },()=>{
      this.getorderconfirm()
    })
  },
  //前往添加地址
  toAddAddress(){
    wx.navigateTo({
      url: '/pages/AddAddress/AddAddress?isFromMakeSureOrder=true',
    })
  },
  //获取支付类型
  GetPlayType(){
    return new Promise((resolve, reject) => {
      let URL = this.data.ProductType == 2 ? 'Paying/GetSolitairePayType' : 'Paying/GetPayType';
      app.globalData.post(URL,{}).then(res=>{
        this.setData({
          payTypeList:res.data.list,
          paytype: res.data.list[0].payType
        })
        resolve(res)
      })
    })
  },

  selectType(e){
    let obj = e.target.dataset;
    this.setData({
      payIndex:obj.index,
      paytype:obj.paytype
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  showBuyMask(e){
    // 如为幸运双拼则不现实弹窗，或余额为0,直接支付
    let orderObj = this.data.orderObj;
    let balance = this.data.toPayByBalance?
                    orderObj.balance> orderObj.TotalsAmount ?
                                              orderObj.TotalsAmount :
                                                        orderObj.balance:0
    if (this.data.ProductType == 2 || balance == 0){
      this.buy()
    }else{
      this.buy()
      // this.setData({ isShowBuyMask: !this.data.isShowBuyMask })
    }

  },
  // 支付方法
  buy(){
    // ProductType == 0 为普通商品
    // ProductType == 1 为幸运双拼
    // ProductType == 2 为免单接龙
    // ProductType == 3 为幸运双拼

    if (this.data.orderObj.DefaultAddress == null && this.data.ActivityInfoType != 8) { //为空代表地址栏未选择默认地址 或ActivityInfoType不为8时
      app.globalData.toast('请先选择或填写默认地址。');
      return
    }
    let URL = 'order/ActivityOrderConfirm';
    if (this.data.isBuying){ //如果支付中，则阻止请求
      return
    }
    
    let paytype = this.data.paytype;//获取支付类型
    if (this.data.OrderObj){//如有订单信息，则表明该订单已生成
      if (this.data.OrderObj.pay){//如果已支付则跳转到支付页
        this.toList(0);
        return
      }
    }

    if (!this.data.OrderIdList){//如未生成订单，则按类型生成订单
      let obj = {
        isPay: true,
        productid: this.data.GoodId,
        orderType: this.data.ProductType,
        remark: this.data.remark,
        addressid: this.data.orderObj.DefaultAddress.Id || this.data.orderObj.DefaultAddress.AddressId,
        packs: this.data.OfflinePack ? "1" : "0",
        offlinePack: this.data.OfflinePack? "1":"0"
      };
  
      // 生成订单
      app.globalData.post(URL, obj).then(res => {
        if (res.data.success == 401) {
          this.setData({ isBindPhone: true })
          return
        }
        if (res.data.success == 200) {//成功执行以下工作
          app.globalData.toast(res.data.msg);//弹出成功信息
          let OrderObj = res.data.data;
          let OrderIdList = res.data.data.OrderIdList;
          let obj = {
            payType: paytype,
            OrderIdList: OrderIdList
          };
          this.setData({ OrderObj, OrderIdList });//存起本地信息
          if (OrderObj.pay){//判断是否已支付
            this.toList(0, OrderIdList);
            this.setData({ isBuying: false }) //表明请求操作已完结
          }else{//未支付则调用支付方法
            this.goPay(obj);
          }
        }else{
          app.globalData.toast(res.data.msg);//弹出失败信息
        }
      })
    }else{//已生成订单，但未支付，则重新调用支付接口
      let obj = {
        payType: paytype,
        OrderIdList: this.data.OrderIdList
      };
      this.goPay(obj);
    }
  },

  // goPay(obj){
    
  //   this.data.payOnlyByGwb ? obj['orderid'] = obj.OrderIdList:null;
  //   let url = this.data.payOnlyByGwb ? 'Paying/GoGoldCoinPay' :'EaPay/GoPay';
  //   app.globalData.post(url, obj).then(res => {
  //     let retData = res.data.retData;
  //     let _this = this;
  //     this.setData({ isBuying: false }); //表明请求操作已完结
  //     if(res.data.success == 200){
  //       try{  
  //         wx.requestPayment({
  //           timeStamp: retData.timeStamp,
  //           nonceStr: retData.nonceStr,
  //           package: retData.package,
  //           signType: 'MD5',
  //           paySign: retData.paySign,
  //           success(res) { _this.toList(0, obj.OrderIdList) },
  //           fail(res) {
  //             getApp().globalData.toast("支付已取消");
  //             setTimeout(() => {
  //               _this.toList(1, obj.OrderIdList, false);
  //             }, 1000)
  //           }
  //         })
  //       } catch(e){
  //         _this.toList(0, obj.OrderIdList)
  //       }
  //     }else{
  //       app.globalData.toast(res.data.msg);
  //     };
  //   })
  // },
  goPay(obj) {
    this.data.payOnlyByGwb ? obj['orderid'] = obj.OrderIdList : null;
    // EaPay / GoPay Paying/GoPay
    let url = this.data.payOnlyByGwb ? 'Paying/GoGoldCoinPay' : 'EaPay/GoPay';
    app.globalData.post(url, obj).then(res => {
      let retData = res.data.retData ? JSON.parse(res.data.retData.paycode) : res.data.retData;
      let _this = this;
      this.setData({ isBuying: false }); //表明请求操作已完结
      if (res.data.success == 200) {
        try {
          wx.requestPayment({
            timeStamp: retData.timeStamp,
            nonceStr: retData.nonceStr,
            package: retData.package,
            signType: retData.signType,
            paySign: retData.paySign,
            success(res) { _this.toList(0, obj.OrderIdList) },
            fail(res) {
              getApp().globalData.toast("支付已取消");
              setTimeout(() => {
                _this.toList(1, obj.OrderIdList, false);
              }, 1000)
            }
          })
        } catch (e) {
          _this.toList(0, obj.OrderIdList)
        }
      } else {
        app.globalData.toast(res.data.msg);
      };
    })
  },

  navigateTo(_url){
    wx.redirectTo({
      url: _url,
    })
  },

  inputPL(e){
    let remark = JSON.parse(this.data.remark);
    remark[e.currentTarget.dataset.groupid] = e.detail.value;
    this.setData({ remark: JSON.stringify(remark)})
  },
  // 跳转到订单列表
  toList(index, OrderIdList, isPaySuccess = true){
    // 普通商品
    var pages = getCurrentPages() 
    if(this.data.ProductType == 0){
      if (this.data.isFromCard){ //如果商品数量大于1
        this.navigateTo(`/pages/newCard/TnewCard?isPaySuccess=${isPaySuccess ? 1 : 2}&orderid=${OrderIdList}`)
      }else{
        this.navigateTo(`/pages/me/page/orderList/orderList?index=${index}`)
      }
    }
    // 天使会员
    if (this.data.ProductType == 1) {
      app.globalData.IsAngel()//天使会员下单成功后，刷新天使会员状态
      this.navigateTo(`/pages/me/page/orderList/orderList?index=${index}`)
    }
    // 免单接龙
    if(this.data.ProductType == 2){
      
      isPaySuccess ? 
        this.navigateTo(`/pages/Active/FreeOfCharge/FreeConfirmation/FreeConfirmation?getCoins=${this.data.orderObj.Amount}`):
        this.navigateTo(`/pages/Active/FreeOfCharge/FreeOfCharge?isaboutme=1`)        
    }

    // 幸运双拼
    if(this.data.ProductType == 3){

      let ProductId = this.data.orderObj.rows[0].LstProduct[0].ProductId;
      if (isPaySuccess){
        this.data.GroupNo ?
          this.navigateTo(`/pages/makeSureOrder/page/LuckyDoubleSuccess/LuckyDoubleSuccess?OrderIdList=${OrderIdList}&ProductId=${ProductId}`) :
          this.navigateTo(`/pages/makeSureOrder/page/LuckyShareConfirm/LuckyShareConfirm?OrderIdList=${OrderIdList}&ProductId=${ProductId}`)
      }else{
         this.navigateTo(`/pages/me/page/orderList/orderList?index=${index}`)
      }
      // this.data.GroupNo ? 
      //       this.navigateTo(`/pages/makeSureOrder/page/LuckyDoubleSuccess/LuckyDoubleSuccess?OrderIdList=${OrderIdList}&ProductId=${ProductId}`):
      //             this.navigateTo(`/pages/me/page/orderList/orderList?index=${index}`)
    }
  }

})