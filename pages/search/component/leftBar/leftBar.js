// pages/search/component/leftBar/leftBar.js
Component({
  properties: {
    list:Array,
    isfixed:{
      type:Boolean
    }
  },
  lifetimes: {
    attached: function () {
      this.setData({ navHeight: getApp().globalData.navHeight });
      wx.getSystemInfo({
        success: function (res) {
      
          let fixedTop = (getApp().globalData.navHeight * (750 / res.windowWidth)) + 100;; 
          this.setData({ fixedTop })
        }
      })
   
    },
  },
  data: {
    activeIndex:0
  },
  methods: {
    emit(e) {
      this.setData({
        activeIndex: e.currentTarget.dataset.activeindex
      })
      this.triggerEvent('getData', { obj: e.currentTarget.dataset }, {})
    }
  }
})
