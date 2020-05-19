const app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLogin:{
      type:Boolean,
    },
    shoppingBalance:{
      type:Number
    },
    addressComponent:{
      type:Object
    }
  },
  attached(){ 
    this.setData({
      logoUrl: baseUrl + 'upload/Picture/comment/201910/bfc8027071cb458aaf7caf54d5678365.png?v=1.0.41',
      dqUrl: baseUrl + 'upload/Picture/comment/201910/0f9c2e60690b473eb4886bde4caffede.png?v=1.0.41',
      downArrowUrl: baseUrl + 'upload/Picture/comment/201910/c1e23b0f64e1445d958fbedaabfec62d.png?v=1.0.41', 
      rmbUrl: baseUrl + 'upload/Picture/comment/201910/ab7089c237b3471d81c1edd2f67ca2ef.png?v=1.0.41',
      OrderUrl: baseUrl + 'upload/Picture/comment/201911/7371424928aa4200a5d1b37b89013d41.png?v=1.0.41',
      AddresssUrl: baseUrl + 'upload/Picture/comment/201911/9f2d1434179b48a4a177cbbbe47dc03a.png?v=1.0.41',
      navHeight: app.globalData.navHeight,//导航栏高度
      statusBar: app.globalData.statusBar
    })
    app.globalData.post('Platform/GetAdvertisements', { AdType:5}).then(res=>{
      this.setData({ bannerImage: res.data.lst[0].PicUrl[0] })
      this.setData({ currentObj: res.data.lst[0]})
    })
  },  
  /**
   * 组件的初始数据
   */
  data: {
    isShowChangeAddressStatus:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toChangeAddress(){
      this.triggerEvent('changeAddress');
      this.changeAddress();
    },
    changeAddress(){
      this.setData({ isShowChangeAddressStatus: !this.data.isShowChangeAddressStatus })
    },
    toAddresss(){
      app.globalData.toast('附近尚未搜寻到合作商家')
    },
    toRule(){
      wx.navigateTo({
        url: '/pages/KoiWelfare/WelfareDescription/WelfareDescription',
      })
    },
    toOrder(){
      if(this.data.isLogin){
        wx.navigateTo({
          url: '/pages/me/page/orderList/orderList',
        })
      }else{
        this.toLogin();
      }
    },
    toLogin(){
      wx.navigateTo({
        url: '/pages/Login/Login',
      })
    },
    toDetail(){
      this.triggerEvent('getBeClickCannelObj', { currentObj: { jump_type: this.data.currentObj.JumpType, jump_address: this.data.currentObj.JumpContent } });
    }
  }
})
