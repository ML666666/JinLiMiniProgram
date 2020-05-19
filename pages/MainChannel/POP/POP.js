const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  lifetimes: {
    attached: function (val) {
      app.globalData.post("Activity/GetShoppingCurrency", {}).then(res => {
        if (res.data.success == 200) {
          console.log(res.data)
          if (res.data.isReceive) {
            this.hideMS();
          } 
        }
      })
    },
  },
  pageLifetimes:{
    show() {
      if (this.data.haveClick){
        app.globalData.post("Activity/GetShoppingCurrency", {}).then(res =>{
          if (res.data.success == 200) {
            if (!res.data.isReceive) {
              wx.navigateTo({
                url: '/pages/Active/GetBi/GetBi',
              })
              this.hideMS();
            } else {
              this.hideMS();
            }
          }
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isLogin:false,
    isShowMsMaks:true,
    isShowMask:false,
    MSMaks:'http://h5.huizhisuo.com/upload/ActivityShare/ReceiveShoppingCurrency.png?v='+Math.random()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPop(){
      app.globalData.post("Platform/GetAdvertisements", { AdType: 1 }).then(res => {
        let t = this;
        try {
          let imgUrl = res.data.lst[0].PicUrl[0];
          if (imgUrl != wx.getStorageSync('PopImgUrl')) {
            t.setData({ isShowMask: true })
            t.setData({ pop: res.data.lst[0] });
            wx.setStorageSync('PopImgUrl', imgUrl)
          } else {
            t.setData({ isShowMask: false })
          }
        } catch (e) {
          t.setData({ isShowMask: false })
        }
      })
    },
    toDetail(){
      this.triggerEvent('getBeClickCannelObj', {
        currentObj: {
          jump_type: this.data.pop.JumpType,
          jump_address: this.data.pop.JumpContent
        }
      });
      this.hide()
    },
    hide(){
      this.setData({ isShowMask: !this.data.isShowMask})
    },
    hideMS(){
      this.setData({ isShowMsMaks:false },()=>{
        this.getPop();
        
      })
    },
    toMS(){
      app.globalData.post("Activity/GetShoppingCurrency", {}).then(res => {
        if (res.data.success == 400){
          wx.navigateTo({
            url: '/pages/Login/Login',
          })
          this.setData({haveClick:true});
          return
        }
        if(res.data.success == 200){
          if (!res.data.isReceive){
            wx.navigateTo({
              url: '/pages/Active/GetBi/GetBi',
            })
            this.hideMS();
          }else{
            app.globalData.toast(res.data.msg);
            this.hideMS();
          }
        }
      })
    }
  }
})
