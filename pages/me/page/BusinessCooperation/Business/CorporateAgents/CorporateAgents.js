const app = getApp();
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
    applyid:null,
  },
  isRefreshing(){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing
    })
  },
  refresh() {
    this.isRefreshing();
    this.GetRegisterRecord().then(() => {
      this.checkIsOk();
      this.isRefreshing();
    })
  },
  toRefresh() {
    this.refresh()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.GetRegisterRecord(options&&options.applyid).then(res=>{
      this.checkIsOk();
      this.isRefreshing();
      this.setData({ isRenderingPage: !this.data.isRenderingPage })
      this.setData(options)
      // if (options.isShowData == 'true') {
      //   this.setData({ active: 3 })
      // }
    })
  },
  GetRegisterRecord(applyid = this.data.applyid){
    return new Promise((resolve,reject)=>{
      app.globalData.post('Supplier/GetRegisterRecord', applyid ? { applyid } : {}).then(res => {
        let obj = res.data.list.find((item) => { return item.ApplyType == 101 });
        if (obj && obj.ShopName) {

          this.setData({
            BusinessShopName: obj.ShopName, //店铺名称
            BusinessIdentityCardName: obj.IdentityCardName, //法人名称
            BusinessIdentityCardNumber: obj.IdentityCardNumber, //身份证号
            BusinessIdentityCardImage_front: JSON.parse(obj.IdentityCardImages).BusinessIdentityCardImage_front, //身份证正面
            BusinessIdentityCardImage_verso: JSON.parse(obj.IdentityCardImages).BusinessIdentityCardImage_verso, //身份证反面
            BusinessCreditCode: obj.BusinessCreditCode, //统一社会信用代码
            BusinessLicenseImage: obj.BusinessLicenseImage, //营业执照
            OpeningPermitImage: obj.OpeningPermitImage, //开户许可证
            CompanyDoorImage: obj.CompanyDoorImage, //公司门头照
            EmployeeOfficeImage: obj.EmployeeOfficeImage, //员工办公照片
            applyid: obj.ApplyId
          })
          this.setData({ active: obj.ApplyStatus })
        }
        resolve(true);
      })
    })
  },
  getImage(e) {
    this.setData(e.detail, () => { this.checkIsOk() })
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
  checkIsOk() {
    let obj = {
      RegisterType: 101,
      BusinessShopName: this.data.BusinessShopName,
      BusinessIdentityCardName: this.data.BusinessIdentityCardName,
      BusinessIdentityCardNumber: this.data.BusinessIdentityCardNumber,
      BusinessIdentityCardImage_front: this.data.BusinessIdentityCardImage_front,
      BusinessIdentityCardImage_verso: this.data.BusinessIdentityCardImage_verso,
      BusinessCreditCode: this.data.BusinessCreditCode,
      BusinessLicenseImage: this.data.BusinessLicenseImage,
      OpeningPermitImage: this.data.OpeningPermitImage,
      CompanyDoorImage: this.data.CompanyDoorImage,
      EmployeeOfficeImage: this.data.EmployeeOfficeImage
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