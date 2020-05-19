// pages/AddAddress/NewAddress/NewAddress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c:{},
    show_area:false,
    address: null,//详细地址
    fullareaname: null,//三级地址
    isdefault: 0,//是否默认地址
    shipphone: null,//用户手机
    shipto:null,//用户名称
    targetAddressObj:{},
    AddressId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  input(e){
    let obj = {};
    obj[e.target.dataset.name] = e.detail.value;
    this.setData(obj);
  },
  // 获取三级地址数据
  onLoad: function (options) {
    this.setData({ windowHeight: app.globalData.windowHeight + app.globalData.navHeight });  
    if(options.addressid){
      let Obj = {}
      app.globalData.post('order/getaddress',{}).then(res=>{
        Obj = res.data.rows.find((item) => { return item.AddressId == options.addressid})
        this.setData({
          targetAddressObj:Obj,
          fullareaname: Obj.FullAreaName,
          shipphone: Obj.ShipPhone,
          shipto: Obj.ShipTo,
          address: Obj.Address,
          AddressId: Obj.AddressId,
          isdefault: Obj.IsDefault
        },()=> {
            app.globalData.post('WXXCX/GetProvinceList', {}).then(res => {
              this.setData({ c: JSON.parse(res.data) }, () => {
                this.data.targetAddressObj.AreaName;
                for (let key in this.data.c.county_list) {
                  this.data.c.county_list[key] == this.data.targetAddressObj.AreaName ? this.setData({ key }) : null
                }
              });
            })
        })
      })
    }else{
      app.globalData.post('order/getaddress', {}).then(res => {this.setData({ isAbsoluteDeafault:res.data.rows.length==0})})
      app.globalData.post('WXXCX/GetProvinceList', {}).then(res => {this.setData({ c: JSON.parse(res.data) });})
    }
  },
  changeIsdefault(){
    if (this.data.isdefault){
      this.setData({ isdefault:0})
    }else{
      this.setData({ isdefault:1})
    }
  },
  // 显示或隐藏三级地址选择器
  setAddress(){
    let show_area = !this.data.show_area;
    this.setData({
      show_area
    })
  },
  // 确认三级地址
  makeSureAddress(e){

    let fullareaname = ''
    let array = e.detail.values;
    for(let k in array){
      fullareaname += (array[k].name)+ '-'
    }
    fullareaname = fullareaname.substr(0, fullareaname.length-1);
    this.setData({ fullareaname })
    e.type == "confirm"?this.setAddress():null;
  },
  // 添加地址
  toAdd(){
    // 根据this.data.AddressId是否为空判断是修改操作或是保存操作
    let URL = this.data.AddressId ? 'order/saveaddress' :'order/addaddress';
    if (!this.data.fullareaname){
      app.globalData.toast("请先选择地址");
      return
    }
    if (!this.data.address) {
      app.globalData.toast("请输入详细地址");
      return
    }
    if (!this.data.shipto) {
      app.globalData.toast("请输入收货人姓名");
      return
    }
    if (!this.data.shipphone) {
      app.globalData.toast("请输入手机号");
      return
    }
    let obj = {
      address: this.data.address,
      fullareaname: this.data.fullareaname,
      isdefault: this.data.isAbsoluteDeafault?1:this.data.isdefault,
      shipphone: this.data.shipphone,
      shipto: this.data.shipto,
    }
    obj['addressid'] = this.data.AddressId?this.data.AddressId:null;
    app.globalData.post(URL, obj).then(res=>{
      res.data.success == 200 ? wx.showToast({
        title: '保存成功!',
      }):app.globalData.toast(res.data.msg);
      res.data.success == 200 ? wx.navigateBack({}):null;
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})