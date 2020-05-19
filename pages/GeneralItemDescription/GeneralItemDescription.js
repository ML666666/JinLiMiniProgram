// pages/GeneralItemDescription/GeneralItemDescription.js
const app = getApp();
Page({

  /**
   * 79960 测试
   * 84363 正式 2级 83420 1级
   * 页面的初始数据
   */
  data: {
    cardNum:0,
    id: null,//当前展示的商品Id
    getproductdetail:{},//商品详情
    getproductdetaildesc:{},//商品图片
    scrollTop:0,//滚动距离顶部的距离=
    ActiveScroll:930,
    show:false, //用于控制 设置规格的模态框
    orderType:1,//下单类型  1：为立即下单 2：为加入购物车
    goodtype: 0, //0为普通商品 1为天使会员 2为幸运双拼 3为免单接龙
    refreshing:true,
    refreshed:false,
    isRenderingPage:true,
    showShare:false,//是否显示分享蒙层
    navHeight: app.globalData.navHeight,
    statusBar: app.globalData.statusBar,
    LstAtt:null,
    isReactBottom:1,
    PickGoodObj:null,
    isactive:false
  },
  onReachBottom(){
    let isReactBottom = this.data.isReactBottom + 1;
    this.setData({ isReactBottom });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  hide(){
    this.onClose()
    this.setData({ show: false })
  },
  onHide() {
    this.onClose()
    this.setData({ show:false})
  },
  onClose: function(){
    this.setData({show:false})
  },
  //加载首页数据
  onLoad:function (options){

    //TwoPersonChipNo == 团号不为''时代表参团
    // console.log(options)
    options.TwoPersonChipNo ?
              this.setData({ TwoPersonChipNo: options.TwoPersonChipNo }): 
                  this.setData({ TwoPersonChipNo:null })
    // goodtype == 0为普通商品
    // goodtype == 1为天使会员
    // goodtype == 2为幸运双拼
    // goodtype == 3为免单接龙
    options.goodtype ? 
              this.setData({ goodtype: options.goodtype }) : 
                  this.setData({ goodtype: 0 });
    // 商品Id             
    options.id ? 
                this.setData({ id: options.id }) :
                    this.setData({ id: app.globalData.goodId });
    // 获取商品数据               
    this.renderData().then(()=>{
      this.isRefreshing(true);
    });
  },
  //渲染商品数据
  renderData(id=null){
    return new Promise((resolve,reject)=>{
      let getproductdetail = app.globalData.post('index/getproductdetail', { productid: id ?id:this.data.id });
      let getproductdetaildesc = app.globalData.post('index/getproductdetaildesc', { productid: id ?id:this.data.id });
      let reGetCarNum = wx.getStorageSync('userInfo') ? this.reGetCarNum() : null;
      Promise.all([getproductdetail, getproductdetaildesc, reGetCarNum]).then(res => {
        try{
          res[0].data.object['goodtype'] = this.data.goodtype;
        }catch(err){
          app.globalData.toast('获取商品详情失败！');
          setTimeout(()=>{
            wx.navigateBack({})
          },3000)
        }
        // new String().includes()
        let desc = res[1].data.object.ProductDesc.replace(/style/g, 'c');
        desc = desc.replace(/<img/g, '<img style="width:100%;height:auto"');
        desc = desc.replace(/onload/g, 'A');
        desc = desc.startsWith('<div') ? desc.replace(/<div/g, `<div style="display:flex;flex-direction: column;"`):
        `<div style="display:flex;flex-direction: column;">` + desc + `</div>`;
        desc = desc.replace(/<p/g, '<p style="display:flex;flex-direction: column;');
        console.log(desc.includes("<P>"))
        res[1].data.object.ProductDesc = desc;
        // res[0].data.object.LstSKU[4] = {};
        this.setData({
          getproductdetail: res[0].data,
          CateId: res[0].data.object.CateId,
          getproductdetaildesc: res[1].data,
          cardNum: res[2]
        },()=>{
          this.setData({ id:id?id: this.data.id })
          setTimeout(()=>{this.getNodeTop();},200)
        })
        resolve(true)
      }).catch((err) => {
        console.log('err');
      })
    })
  },
  //获取评论区跟展示区距离顶部的距离
  getNodeTop(){
    let _this = this;
    var query = wx.createSelectorQuery();
    query.select('#comment').boundingClientRect()
    query.exec(function (res) {
      _this.setData({ commentTop:res[0].top-100 });
    })
    query.select('#richText').boundingClientRect()
    query.exec(function (res) {
      _this.setData({ richTextTop: res[1].top-100 });
    })
  },
  // 滚动到指定位置
  scorllTo(e){
    wx.pageScrollTo({
      scrollTop: e.currentTarget.dataset.top
    })
  },
  // 下拉刷新
  refresh(id){
    let cid = typeof id == 'object'?this.data.id:this.data.id;
    this.isRefreshing();
    this.renderData(cid).then(res=>{
      this.isRefreshing();
    })
  }, 
  isRefreshing(isRenderingPage=false){
    this.setData({ refreshing: !this.data.refreshing, refreshed: !this.data.refreshed});
    isRenderingPage ? this.setData({ isRenderingPage: !this.data.isRenderingPage}):null;
  },
  //监听滚动条
  onPageScroll: function (e) {
    this.setData({
      scrollTop:e.scrollTop
    })
  },
  //重新获取购物车数量
  toReGetCarNum(){
    this.reGetCarNum().then(res=>{
      this.setData({ cardNum:res })
    })
  },
  //重新获取购物车数据
  reGetCarNum() {
    return new Promise((resolve,reject)=>{
      app.globalData.post('order/getshoppingcartnum',{}).then(res=>{
        res.data.success == 200 ? resolve(res.data.object.productNum) : resolve('');
      })
    })
  },
  //滚动到某个位置
  scrollTo:function(e){
    wx.pageScrollTo({
      scrollTop: e.target.dataset.heigth  
    })
  },
  //获取选中商品SKU
  getPickGoodObj(e){
    let PickGoodObj = e.detail.PickGoodObj;
    if (PickGoodObj){
      this.setData({ PickGoodObj: e.detail.PickGoodObj });
      if (this.data.getproductdetail.object.ProductType == 7){ //苏宁商品
        if (PickGoodObj.ProductId != this.data.id){
          this.setData({ id: PickGoodObj.ProductId });
          this.refresh(PickGoodObj.ProductId);
          return
        }
      }
    }
  },
  setOrder(e){
    this.setData({
      orderType: e.detail.type,
      GroupNo: e.detail.GroupNo,
      show:true,
      isactive: e.detail.isactive  //是否地推活动0元商品
    })
  },
  toShare(e){
    this.setData({ showShare: !this.data.showShare });
  },
  onShareAppMessage: function () {
    let title =  `${this.data.getproductdetail.object.SalePrice}元 ${this.data.getproductdetail.object.ProductTitle}`;
    let path =  `/pages/GeneralItemDescription/GeneralItemDescription?id=${this.data.id}&goodtype=${this.data.goodtype}`;
    let imageUrl = this.data.getproductdetail.object.ProductImg[0].ImgUrl;
    let shareObj = app.globalData.interceptShare(path, title, imageUrl)
    return shareObj
  },
  back(){
    if (getCurrentPages().length==1){
      wx.switchTab({
        url: '/pages/MainChannel/MainChannel',
      })
      return
    }else{
      wx.navigateBack({})
    }
  },
  toCard(){
    wx.navigateTo({
      url: '/pages/newCard/TnewCard?isFromGoodDetail=true',
      })
  },
})