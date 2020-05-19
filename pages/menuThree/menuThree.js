
// pages/menuThree/menuThree.js
const app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaulbandtUrl: `${baseUrl}upload/Picture/comment/201910/87abf31da835498489ccce1d28dd0851.png?v=1.0.41`,
    defaulShoptUrl: `${baseUrl}upload/Picture/comment/201910/7382914450e74704aed371d660accbe5.png?v=1.0.41`,
    Group_id:null,
    SupplierId:null,//商场Id
    SupplierName:null,//商场名称
    pageindex: 1,
    pagesize: 10,
    getcategoryTopData:null,//头部信息
    getcategoryproduct:null,//商品信息
    isOver:false,
    navHeight:null,
    statusBar:null,
    keyword:null,
    sort: 0,
    sortDirection: false,
    rows:[],
    isOver:false,
    isActive:false,
    isOpen:false,//是否展示店铺描述
    limiteNum: 49,
    activeMaks:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  isOpen(){
    if (this.data.defaultDescribe.length < this.data.limiteNum){
      return
    }
    this.setData({ isOpen: !this.data.isOpen });
  },
  onPageScroll(e) {
    this.setData({ isActive: e.scrollTop > 50});
  },
  onLoad: function (options) {
    let brandId = options.brandId || 0;
    let Group_id = options.Group_id || 0;
    let SupplierId = options.SupplierId || 0;
    let SupplierName = options.SupplierName || '锦鲤家居生活特选馆';
    this.setData({
      brandId,
      Group_id,
      SupplierId,
      SupplierName,
      navHeight: app.globalData.navHeight,//导航栏高度
      statusBar: app.globalData.statusBar
    },()=>{
      if (this.data.SupplierId){
        this.getShopData(this.data.pageindex);
        this.getSupplierTopData();
      }
      this.data.brandId ? this.getBrandInfo():'';
      this.GetSpecialAreaProduct().then(rows=>{
        this.setData({ rows })
      });
    })
  },
  GetSpecialAreaProduct(pageindex = this.data.pageindex) {
    return new Promise((resolve, reject) => {
      let obj = {
        pageindex: pageindex,
        pagesize: this.data.pagesize,
        keyword: this.data.keyword ? this.data.keyword:'',
        sort: this.data.sort,
        sortDirection: this.data.sortDirection ? 1 : 0,
        gwb: this.data.gwb
      }
      this.data.SupplierId ? obj['shopId'] = this.data.SupplierId : null;
      this.data.brandId ? obj['brandId'] = this.data.brandId : null;
      app.globalData.post('index/getsearchproduct', obj).then(res => {
        resolve(res.data.rows);
      })
    })
  },
  toCheckQualificationImg(e){
    let shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `/pages/menuThree/toCheckQualificationImg/toCheckQualificationImg?shopid=${shopid}`,
    })
  },
  input(e){
    let name = e.target.dataset.name;
    let obj = {};
    obj[name] = e.detail.value;
    this.setData({ keyword: e.detail.value })
  },
  toSearch(e){
    this.setData({pageindex:1},()=>{
      this.GetSpecialAreaProduct().then(rows => {
        this.setData({ rows })
      });
    })
  },
  back(){
    wx.navigateBack({})
  },
  getSupplierTopData(){
    let obj = {
      SupplierId: this.data.SupplierId,
      categoryid: this.data.Group_id
    }
    let post = app.globalData.post('index/getcategoryTopData',obj).then(res=>{
      this.setData({
        getcategoryTopData:res.data
      })
    })
  },
  getShopData(pageindex){
    return new Promise((resolve,reject)=>{
      let obj = {
        shopId: this.data.SupplierId,
      }
      let post = app.globalData.post('index/getShopInfo', obj).then(res => {
        // res.data.Share.Describe = '这家店的东西太赞了了这家店的东西太赞了了这家店的东西太赞了了这家店的东西太赞了这家店的东西太赞了赞了赞了'
        let topData = res.data.shop;
        let Describe = topData.ShopIntro && topData.ShopIntro.length >= this.data.limiteNum ? 
                       topData.ShopIntro.substr(0, 45) + '...' : 
                       topData.ShopIntro;
        topData.AdvertPicture = topData.AdvertPicture.split(',')[0]
        this.setData({ topData });
        this.setData({ AdvertPicture:topData.AdvertPicture ? topData.AdvertPicture : this.data.defaulShoptUrl })
        this.setData({ Describe })
        this.setData({ defaultDescribe: res.data.shop.ShopIntro})
        this.setData({ totalcount: res.data.shop.ProTotalNum })
        this.setData({ CustomTitle: topData.ShopName });
        this.setData({ CustomText: topData.ShopIntro });
        this.setData({ ImgSrc: topData.ShopIco})
        resolve(res);
      })
    })
  },
  getBrandInfo() {
    app.globalData.post('index/getBrandInfo', { brandId: this.data.brandId }).then(res => {
      let brandInfo = res.data.brandInfo;
      let Describe = brandInfo.BrandDesc && brandInfo.BrandDesc.length >= this.data.limiteNum ?
        brandInfo.BrandDesc.substr(0, 45) + '...' :
        brandInfo.BrandDesc;
      this.setData({ brandInfo });
      this.setData({ defaultDescribe: brandInfo.BrandDesc })
      this.setData({ AdvertPicture: this.data.defaulbandtUrl })
      this.setData({ Describe })
      this.setData({ totalcount: brandInfo.ProTotalNum });
      this.setData({ CustomTitle: brandInfo.BrandName });
      this.setData({ CustomText: brandInfo.BrandDesc });
      this.setData({ ImgSrc: brandInfo.Icon })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isOver) {
      return
    }
    let rows = this.data.rows;
    let pageindex = this.data.pageindex;
    this.setData({ pageindex: pageindex + 1 }, () => {
      this.GetSpecialAreaProduct().then(_rows => {
        rows = [...rows, ..._rows];
        this.setData({ isOver: _rows.length < this.data.pagesize });
        this.setData({ rows });
      })
    })
  },
  toDetail(e){
    wx.navigateTo({
      url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${e.currentTarget.dataset.id}`,
    })
  },
  tap(e) {
    let sort = e.currentTarget.dataset.sort;
    this.data.sort == sort && (sort == 2) ?
      this.setData({ sortDirection: !this.data.sortDirection }) :
      this.setData({ sortDirection: false })
    this.setData({ sort }, () => {
      this.GetSpecialAreaProduct().then(rows => {
        this.setData({ rows })
      })
    })
  },
  getStatus(e) {
    e.detail['pageindex'] = 1;
    this.setData(e.detail, () => {
      this.GetSpecialAreaProduct().then(rows => {
        this.setData({ rows })
      })
    })
  },
  input(e) {
    console.log(e);
    let obj = {};
    obj[e.target.dataset.name] = e.detail.value;
    this.setData(obj);
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   let title =  `${this.data.SupplierName}`
  
  //   let shareObj = app.globalData.interceptShare(path, title)
  //   return shareObj
  // },
  isShare(){
    this.setData({ activeMaks: !this.data.activeMaks })
  },
  onShareAppMessage: function () {
    let path = `pages/menuThree/menuThree?Group_id=${this.data.Group_id}&SupplierId=${this.data.SupplierId}&SupplierName=${this.data.SupplierName}&brandId=${this.data.brandId}`
    let shareObj = app.globalData.interceptShare(path, this.data.CustomTitle, this.data.AdvertPicture, this.data.CustomText)
    return shareObj
  }
})