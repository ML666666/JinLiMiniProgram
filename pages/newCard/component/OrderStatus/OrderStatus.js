const app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isPaySuccess:{
      type:Number,
      observer(val) {
        this.setData({ _isPaySuccess:val})
        if(val==2){
          this.GetPlayType();
        }
      }
    },
    orderid:{
      type:Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    wx_Url: baseUrl + 'upload/Picture/comment/201911/7cf0063754f14392affacaf7276594f9.png?v=1.0.41',
    zf_Url: baseUrl + 'upload/Picture/comment/201911/a1d4c0b532b1435c93387ca6d3d4db05.png?v=1.0.41',
    isShowMask:false,
    s_URL: baseUrl +'upload/Picture/comment/201911/eecb347df0c649dd976102fe2518b668.png?v=1.0.41',
    fail_URL: baseUrl+'upload/Picture/comment/201911/eecb347df0c649dd976102fe2518b668.png?v=1.0.41'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toOrder(){
      wx.navigateTo({
        url: '/pages/me/page/orderList/GeneralOrderDetails/GeneralOrderDetails?orderid=' + this.properties.orderid,
      })
    },
    toHome(){
      wx.switchTab({
        url: '/pages/MainChannel/MainChannel',
      })
    },
    isShowMaskFn(){
      this.setData({ isShowMask: !this.data.isShowMask });
    },
    GetPlayType() {
      return new Promise((resolve, reject) => {
        let URL =  'Paying/GetPayType';
        app.globalData.post(URL, {}).then(res => {
          this.setData({
            payTypeList: res.data.list,
            paytype: res.data.list[0].payType,
            payIndex:0
          })
          resolve(res)
        })
      })
    },
    selectType(e) {
      let obj = e.target.dataset;
      this.setData({
        payIndex: obj.index,
        paytype: obj.paytype
      })
    },
    toPay(e) {
      if (this.data.isBuying){
        return
      }
      this.setData({ isBuying: true });
      let payType = this.data.paytype;
      let OrderIdList = this.properties.orderid;
      let _this = this;
      app.globalData.post('EaPay/GoPay', { payType, OrderIdList }).then(res => {
        let retData = res.data.retData;
        this.setData({ isBuying: false }); //表明请求操作已完结
        if (res.data.success == 200) {
            wx.requestPayment({
              timeStamp: retData.timeStamp,
              nonceStr: retData.nonceStr,
              package: retData.package,
              signType: retData.signType,
              paySign: retData.paySign,
              success(res) { _this.setData({ _isPaySuccess: 1 }); _this.isShowMaskFn() },
              fail(res) { app.globalData.toast('取消支付') }
            })
        } else {
          app.globalData.toast(res.data.msg);
        };
      })
    },
  }
})
