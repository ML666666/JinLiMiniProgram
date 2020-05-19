// pages/search/component/searchTop/searchTop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  lifetimes:{
    attached: function () {
      this.setData({ navHeight: getApp().globalData.navHeight});
    },
  },
  methods: {
    toKefu(){
      wx.navigateTo({
        url: '/pages/webView/webView',
      })
    },
    toMsg(){
      wx.navigateTo({
        url: '/pages/search/MessageQueue/MessageQueue',
      })
    },
    toSearch(){
      wx.navigateTo({
        url: '/pages/search/SearchResult/SearchResult',
      })
    }
  }
})
