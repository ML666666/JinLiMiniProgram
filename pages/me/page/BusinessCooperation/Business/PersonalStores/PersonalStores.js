const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:3,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true,
    isEditData: true,
    applyid:null
  },  
  isrefreshing(){
    this.setData({ refreshing: !this.data.refreshing, refreshed: !this.data.refreshed })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  refresh(){
    this.isrefreshing();
    this.GetRegisterRecord().then(() => {
      this.checkIsOk();
      this.isrefreshing();
    })
  },
  toRefresh(){
    this.refresh()
  },
  onLoad: function (options) {
    console.log(options)
    this.GetRegisterRecord(options && options.applyid).then(()=>{
      this.checkIsOk();
      this.isrefreshing();
      this.setData({ isRenderingPage: !this.data.isRenderingPage });
      this.setData(options)
      // if (options.isShowData == 'true') {
      //   this.setData({ active: 3 })
      // }
    })
  },
  GetRegisterRecord(applyid = this.data.applyid){
    return new Promise((resolve,reject)=>{
      app.globalData.post('Supplier/GetRegisterRecord', applyid?{ applyid }:{}).then(res => {
        let obj = res.data.list.find((item) => { return item.ApplyType == 102 });
        if (obj && obj.ApplyTime) {
          this.setData({
            BusinessIdentityCardName: obj.IdentityCardName,
            BusinessIdentityCardNumber: obj.IdentityCardNumber,
            BusinessIdentityCardImage_front: JSON.parse(obj.IdentityCardImages).BusinessIdentityCardImage_front, //身份证正面
            BusinessIdentityCardImage_verso: JSON.parse(obj.IdentityCardImages).BusinessIdentityCardImage_verso, //身份证反面
            BankAccount: obj.BankAccount,
            OpenBank: obj.OpenBank,
            applyid: obj.ApplyId
          })
          this.setData({ active: obj.ApplyStatus });
        }
        resolve(true);
      })
    })
  },
  makeSure() {
    if (this.data.isEditData == 'false') {
      app.globalData.toast('正在审核中,不能编辑')
      return
    }
    if (this.data.isFillOut) {
      app.globalData.post('Supplier/OfflineShopRegister', this.data.obj).then(res => {
        if (res.data.success == 200) {
          this.setData({ active: 0 });
        }
      })
    } else {
      app.globalData.toast('请完善表单信息')
    }
  },
  inputValue(e) {
    let value = e.detail.value
    let name = e.target.dataset.name;
    let obj = {};
    obj[name] = value;
    this.setData(obj, () => { this.checkIsOk() });
  },
  getImage(e) {
    this.setData(e.detail, () => { this.checkIsOk() })
  },
  checkIsOk() {
    let obj = {
      RegisterType: 102,
      BusinessIdentityCardName: this.data.BusinessIdentityCardName,
      BusinessIdentityCardNumber: this.data.BusinessIdentityCardNumber,
      BusinessIdentityCardImage_front: this.data.BusinessIdentityCardImage_front,
      BusinessIdentityCardImage_verso: this.data.BusinessIdentityCardImage_verso,
      BankAccount: this.data.BankAccount,
      OpenBank: this.data.OpenBank
    }
    let num = 0;
    for (let v in obj) {
      if (obj[v]) {
        num++;
      } else {
        obj[v] = ''
      }
    }
    this.setData({ obj })
    this.setData({ isFillOut: num == Object.getOwnPropertyNames(obj).length })
  }
})