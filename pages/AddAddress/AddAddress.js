// pages/AddAddress/AddAddress.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */

  data: {
    addressList:[],
    windowHeight:null,//屏幕可用高度
    navHeight:null,//导航栏高度
    haveLoadData:false,//是否已经加载过数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // 获取手机信息
    options.isFromMakeSureOrder ? this.setData({ isFromMakeSureOrder: true}):this.setData({isFromMakeSureOrder:false})//判断是否来自下单页
    this.setData({ windowHeight: app.globalData.windowHeight + app.globalData.navHeight});
    this.getList().then(res=>{
      this.setData({haveLoadData:true});
    });
  },
  onShow(){
    if (this.data.haveLoadData){
      this.getList().then(res => {
        // 如果默认只有一个地址，且来自下单页面，则返回时将订单地址设为用户地址第一个
        if (this.data.addressList.length == 1 && this.data.isFromMakeSureOrder) {
          var pages = getCurrentPages(); // 获取页面栈
          var prevPage = pages[pages.length - 2]; // 上一个页面
          let orderObj = prevPage.data.orderObj;
          let addressObj = this.data.addressList[0];
          addressObj['Id'] = addressObj.AddressId;
          orderObj.DefaultAddress = addressObj;
          prevPage.setData({
            orderObj
          },()=>{
            prevPage.getorderconfirm(true);//改变地址后重新获取订单信息
            prevPage.getaddress();
          })
        }
      });
    }
  },
  edit(e){
    let addressid = e.currentTarget.dataset.addressid;
    wx.navigateTo({
      url: `/pages/AddAddress/NewAddress/NewAddress?addressid=${addressid}`,
    })
  },
  // 跳转到添加地址页
  toAddAddress(){
    wx.navigateTo({
      url: '/pages/AddAddress/NewAddress/NewAddress',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  tapAddress(e){
    this.data.isFromMakeSureOrder ? this.changeOrderAddress(e) : this.changeIsDeafult(e)
  },

  // 订单页点击选择地址会触发该方法
  changeOrderAddress(e){

    var pages = getCurrentPages(); // 获取页面栈
    var prevPage = pages[pages.length - 2]; // 上一个页面
    let orderObj = prevPage.data.orderObj;
    let index = e.currentTarget.dataset.index;
    let addressObj = this.data.addressList[index];
    addressObj['Id'] = addressObj.AddressId;
    orderObj.DefaultAddress = addressObj;
    prevPage.setData({
      orderObj
    },()=>{
      console.log(prevPage);
      prevPage.getorderconfirm(true);//改变地址后重新获取订单信息
      prevPage.getaddress()
      wx.navigateBack({})
    })
    // console.log(orderObj.DefaultAddress)
    console.log(addressObj)
  },
  delete(e){
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '是否删除该地址？',
      success: (res) => {
        if (res.confirm) {
          let addressid = e.currentTarget.dataset.addressid;
          let index = _this.data.addressList.find((item, index) => { return item.AddressId == addressid });

          //判断当前被删除的地址是否默认地址，如为默认地址则需重新指定默认地址
          let IsDefault = index.IsDefault;
          let nextDefaultAddress = null;
          if (IsDefault) {
            for (let k in _this.data.addressList) {
              if (!_this.data.addressList[k].IsDefault) {
                nextDefaultAddress = _this.data.addressList[k];
                break;
              }
            }
          }
          app.globalData.post('order/deleteaddress', { addressid: addressid }).then(res => {
            res.data.success == 200 ? _this.getList() : null;
            nextDefaultAddress && res.data.success == 200 ? app.globalData.post('order/saveaddressdefault', {
              addressid: nextDefaultAddress.AddressId,
              isdefault: 1
            }).then(res => {
              res.data.success == 200 ? _this.getList() : null;
            }) : '';
            res.data.success == 200 ? app.globalData.toast('删除地址成功！') : null;
          })
        } else if (res.cancel) {}
      }
    })

  },
  // 改变当前订单是否默认的状态
  changeIsDeafult(e){
    // console.log(e.currentTarget.dataset.addressid);
    let obj = {
      addressid: e.currentTarget.dataset.addressid,
      isdefault: 1
    }
    app.globalData.post('order/saveaddressdefault',obj).then(res=>{
        if(res.data.success==200){
          this.getList();
          
          if(this.data.isFromMakeSureOrder){
            var pages = getCurrentPages(); // 获取页面栈
            var prevPage = pages[pages.length - 2]; // 上一个页面
            let orderObj = prevPage.data.orderObj;
            let index = e.currentTarget.dataset.index;
            let addressObj = this.data.addressList[index];
            addressObj['Id'] = addressObj.AddressId;
            orderObj.DefaultAddress = addressObj;
            prevPage.setData({
              orderObj
            }, () => {
              prevPage.getorderconfirm(true);//改变地址后重新获取订单信息
              prevPage.getaddress()
              wx.navigateBack({})
            })
          }
        }else{
          app.globalData.toast(res.data.msg);
        }
    })
  },
  // 获取地址列表
  getList(){
    return app.globalData.post('order/getaddress', {}).then(res => {
      res.data.success == 200 ? this.setData({
        addressList: res.data.rows
      }) : app.globalData.toast(res.data.msg)
    })
  }
})