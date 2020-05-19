// pages/me/page/orderList/component/OrderStatus.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{ //订单信息
      type:Object
    },
    payTypelist:{ //支付类型
      type:Array
    },
    OrderId:{ //订单ID
      type:Number
    },
    isSP:{ //是否双拼
      type:Boolean
    }
  },

  /**
   * 组件的初始数据
   */

  data: {
    isShowMakeSureOrderMask:false, 
    isBuying:false, //是否正在只自付中
    isCheckExpress:false,//是否预览物流信息
    isLoadingExpress:true,//是否正在加载物流信息
    expressData:null
  },
  // Paying/GetPayType
  /**
   * 组件的方法列表
   */
  methods: {
    // 是否展示重新购买
    showMakeSureOrderMask(){
      this.setData({ isShowMakeSureOrderMask: !this.data.isShowMakeSureOrderMask})
    },
    // 重新刷新订单列表
    reSetData(msg){
      msg?app.globalData.toast(msg):null;
      this.triggerEvent('reSetData', {})
    },
    // 申请退款 取消订单触发该方法
    tuikuan(e){
      let content = e.currentTarget.dataset.content;
      
      wx.showModal({
        title: '提示',
        content: '是否取消该订单？',
        success: (res) => {
          if (res.confirm) {
            app.globalData.post('account/closemyorder', { OrderId: this.properties.item.OrderId}).then(res=>{
              res.data.success == 200 ? this.reSetData(res.data.msg) : app.globalData.toast(res.data.msg);
            })
          } else if (res.cancel) {
            console.log(this.properties.payTypelist);
          }
        }
      })
    },
    // 重新支付调用该方法
    toPay(e){
      if (this.data.isBuying){
        return
      }
      this.setData({ isBuying: true });
      // let payType = e.currentTarget.dataset.paytype;
      let _this = this;
      let payType = this.properties.payTypelist[0].payType;
      let OrderIdList = this.properties.OrderId;
      app.globalData.post('YopPay/GoPay', { payType, OrderIdList }).then(res => {
          let retData = res.data.retData ? JSON.parse(res.data.retData) : res.data.retData;
          this.setData({ isBuying: false }); //表明请求操作已完结
          if(res.data.success == 200){
            try{
              wx.requestPayment({
                timeStamp: retData.timeStamp,
                nonceStr: retData.nonceStr,
                package: retData.package,
                signType: retData.signType,
                paySign: retData.paySign,
                success(res) { _this.reSetData(); },
                fail(res) { app.globalData.toast('取消支付') }
              })
            }catch(e){
              _this.reSetData();
            }
          }else{ 
            app.globalData.toast(res.data.msg);
          };
      })
    },
    
    //是否获取物流信息
    isShowCheckExpress(){
      this.setData({ isLoadingExpress: true});
      this.setData({ isCheckExpress: !this.data.isCheckExpress},()=>{
        if(this.data.isCheckExpress){
          app.globalData.post('order/GetExpressDelivery', { orderid: this.properties.OrderId,ordertype: 0}).then(res=>{
            console.log(res.data.rows[0].data);
            this.setData({ expressData: res.data, isLoadingExpress: false});
          })
        }
      })
    },
    //确认订单
    makeSureOrder(){
      app.globalData.post('account/receivedmyorder', { orderId: this.properties.OrderId}).then(res=>{
        app.globalData.toast(res.data.msg);
        res.data.success == 200 ? this.reSetData() : app.globalData.toast(res.data.msg);
      })
    },
    // 前往评论区
    toComment(){
      console.log(this.properties.OrderId);
      // return
      wx.navigateTo({
        url: `/pages/me/page/orderList/Comment/Comment?OrderId=${this.properties.OrderId}`,
      })
    }
  }
})
