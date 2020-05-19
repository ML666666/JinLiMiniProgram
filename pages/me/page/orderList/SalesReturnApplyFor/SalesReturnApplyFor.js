const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:null,
    orderitemid:null,
    rows:{},
    AddressObj:{},
    ActiveAddressObj:{},
    isPopupShow:false,
    reason: null,//退货原因
    orderExpressCode: null,//退货单号
    isSetExpressDetail:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      productid: options.productid,
      orderid: options.orderid,
      orderitemid: options.orderitemid
    })
    let one = this.getmyorderDetail();
    let two = this.GetReturnAddress();
    Promise.all([one,two]).then(res=>{
      this.setData({ rows:res[0].data});
      let LstProduct = res[0].data.rows.LstProduct.filter(item => { return item.OrderItemId == options.orderitemid});
      console.log(LstProduct);
      this.setData({ LstProduct });
      this.setData({ AddressObj:res[1].data});
      this.setAddress(this.data.AddressObj.lsLogisticsCompany);
    })
  },
  setAddress(list){
    let addressList = [];
    for (let v in list) {
      addressList.push(list[v].LogisticsCompanyName);
    }
    this.setData({ addressList })
  },
  getmyorderDetail(){
    return new Promise((resolve,reject)=>{
      app.globalData.post('account/getmyorderDetail', { orderid: this.data.orderid }).then(res => {
        resolve(res);
      })
    })
  },
  GetReturnAddress(){
    return new Promise((resolve,reject)=>{
      app.globalData.post('order/GetReturnAddress', { productid: this.data.productid }).then(res=>{
        resolve(res)
      })
    })
  },
  onChangeAddressList(e){
    let ActiveAddressObj = {};
    ActiveAddressObj.index = e.detail.index;
    ActiveAddressObj.value = e.detail.value;
    this.setData({ActiveAddressObj});
  },
  showPopup(){
    this.setData({ isPopupShow: !this.data.isPopupShow });
  },
  hidePopup(){
    this.setData({ isPopupShow: !this.data.isPopupShow},()=>{
      if(!this.data.isPopupShow){
        let ActiveAddressObj = {};
        ActiveAddressObj.index = 0;
        ActiveAddressObj.value = this.data.addressList[0];
        this.data.ActiveAddressObj.value ? null : this.setData({ ActiveAddressObj})
      }
    })
  },
  input(e){
    let name = e.currentTarget.dataset.name;
    let obj = {};
    obj[name] = e.detail.value;
    this.setData(obj);
  },
  setExpressDetail(){
    this.setData({ isSetExpressDetail: !this.data.isSetExpressDetail});
  },
  makeSureExpressDetail(){
    if (!this.data.orderExpressCode){
      app.globalData.toast('请选择快递单号')
      return
    }
    if (!this.data.ActiveAddressObj.value){
      app.globalData.toast('请选择快递公司')
      return
    }
    this.setData({ isSetExpressDetail: !this.data.isSetExpressDetail });
  },
  makeSureSubmit(){
    if (this.data.isSetExpressDetail){
      app.globalData.toast('请先确定快递信息');
      return
    }
    if (!this.data.reason){
      app.globalData.toast('请先填写退款原因');
      return
    }
    let obj = {
      OrderId: this.data.orderid,
      OrderItemId: this.data.orderitemid,
      RefundInstruction: this.data.reason,
      ShipmentName: this.data.ActiveAddressObj.value,
      ShipmentNumber: this.data.orderExpressCode
    }
    app.globalData.post('order/ReturnApplication',obj).then(res=>{
      res.data.success == 200 ? wx.navigateTo({
        url: `/pages/me/page/orderList/GeneralOrderDetails/GeneralOrderDetails?orderid=${this.data.orderid}`,
      }):app.globalData.toast(res.data.msg);
    })
  }
})