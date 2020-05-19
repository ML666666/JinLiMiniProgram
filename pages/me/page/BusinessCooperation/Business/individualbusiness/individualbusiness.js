const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFillOut:false,
    active:3,
    obj:{},
    refreshed:false,
    refreshing:true,
    isRenderingPage:true,
    isEditData: true,
    applyid:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  isRefreshing(){
    this.setData({ refreshed: !this.data.refreshed, refreshing: !this.data.refreshing})
  },
  onLoad: function (options){
    console.log(options)
    this.GetRegisterRecord(options && options.applyid).then(()=>{
      this.checkIsOk();
      this.isRefreshing();
      this.setData({ isRenderingPage: !this.data.isRenderingPage});
      this.setData(options)
      // if (options.isShowData == 'true') {
      //   this.setData({active:3})
      // }
    })
  },
  refresh(){
    this.isRefreshing();
    this.GetRegisterRecord().then(() => {
      this.checkIsOk();
      this.isRefreshing();
    })
  },
  GetRegisterRecord(applyid = this.data.applyid) {
    return new Promise((resolve,reject)=>{
      app.globalData.post('Supplier/GetRegisterRecord', applyid ? { applyid } : {}).then(res => {
        let obj = res.data.list.find((item) => { return item.ApplyType == 100 });
        if (obj && obj.ShopName) {
          
          this.setData({
            BusinessShopName: obj.ShopName, //店铺名称
            BusinessIdentityCardName: obj.IdentityCardName, //法人名称
            BusinessIdentityCardNumber: obj.IdentityCardNumber, //身份证号
            BusinessIdentityCardImage_front: JSON.parse(obj.IdentityCardImages).BusinessIdentityCardImage_front, //身份证正面
            BusinessIdentityCardImage_verso: JSON.parse(obj.IdentityCardImages).BusinessIdentityCardImage_verso, //身份证反面
            BankAccount: obj.BankAccount, //银行账户
            OpenBank: obj.OpenBank, //银行卡开户行
            BusinessCreditCode: obj.BusinessCreditCode, //统一社会信用代码
            BusinessLicenseImage: obj.BusinessLicenseImage, //营业执照
            BusinessPlaceImages: obj.BusinessPlaceImages, //经营场所照片
            applyid: obj.ApplyId
          })
          this.setData({ active: obj.ApplyStatus })
    
        } 
        resolve(true);
      })
    })
  },
  makeSure(){
   
    if (this.data.isEditData == 'false'){
      app.globalData.toast('正在审核中,不能编辑')
      return
    }
    if (this.data.isFillOut){
      app.globalData.post('Supplier/OfflineShopRegister',this.data.obj).then(res=>{
        if(res.data.success==200){
          this.setData({active:0});
        }
      })
    }else{
      app.globalData.toast('请完善表单信息')
    }
  },
  toRefresh(){
    
  },
  getImage(e){
    this.setData(e.detail, () => { this.checkIsOk()})
  },
  inputValue(e){
    let value = e.detail.value
    let name = e.target.dataset.name;
    let obj = {};
    obj[name] = value;
    this.setData(obj,()=>{this.checkIsOk()});
  },
  checkIsOk(){
    let obj = {
      RegisterType:100,
      BusinessShopName: this.data.BusinessShopName,
      BusinessIdentityCardName: this.data.BusinessIdentityCardName,
      BusinessIdentityCardNumber: this.data.BusinessIdentityCardNumber,
      BusinessIdentityCardImage_front: this.data.BusinessIdentityCardImage_front,
      BusinessIdentityCardImage_verso: this.data.BusinessIdentityCardImage_verso,
      BankAccount: this.data.BankAccount,
      OpenBank: this.data.OpenBank,
      BusinessCreditCode: this.data.BusinessCreditCode,
      BusinessLicenseImage: this.data.BusinessLicenseImage,
      BusinessPlaceImages: this.data.BusinessPlaceImages ? JSON.stringify([this.data.BusinessPlaceImages]):''
    }
    let num = 0;
    for (let v in obj){
      if (obj[v]){
        num++
      }else{
        obj[v] = ''
      }
    }
    this.setData({ obj })
    this.setData({ isFillOut: num == Object.getOwnPropertyNames(obj).length })
  }
})