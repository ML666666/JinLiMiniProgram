// pages/me/component/header/header.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userObj:{
      type:Object
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    paddingTop:null,
    isCheckAngel:false,
    angel_status_1:"http://h5.huizhisuo.com/upload/Picture/comment/201911/15955d54d3544992a28726038e99dc74.png?v=1.0.43",
    angel_status_2:"http://h5.huizhisuo.com/upload/Picture/comment/201911/219f6d48e2174e06977e0185f573ce3b.png?v=1.0.43",
    angel_status_3:"http://h5.huizhisuo.com/upload/Picture/comment/201911/239239baaf44452e97a178ff31b949d9.png?v=1.0.43"
  },

  /**
   * 组件的方法列表
   */
  attached(){
    this.setData({ paddingTop: app.globalData.navHeight - app.globalData.statusBar});
    this.setData({ IsAngel: wx.getStorageSync('IsAngel')});
  },
  methods: {
    toYe(){
      wx.navigateTo({
        url: '/pages/me/page/RemainingSum/RemainingSum',
      })
    },
    toW(){
      wx.navigateTo({
        url: '/pages/AngelGiftBag/AngelGiftBag',
      })
    },
    toDk(){
      wx.navigateTo({
        url: '/pages/me/page/DeductMoney/DeductMoney',
      })
    },
    toCollection(){
      wx.navigateTo({
        url: '/pages/me/page/Collection/Collection',
      })
    },
    toggleCheckAngel(){
      this.setData({ isCheckAngel: !this.data.isCheckAngel })
    },
    toAngel(){
      wx.switchTab({
        url: '/pages/AngelGiftBag/AngelGiftBag',
      })
      this.setData({ isCheckAngel: !this.data.isCheckAngel })
    },
    toAngelDetail(){
      wx.navigateTo({
        url: '/pages/me/page/AngelDetail/AngeDetail',
      })
    }
  }
})
