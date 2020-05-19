const app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl
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
    imgUrl:baseUrl+'upload/Picture/comment/201911/932c968678b548809161f81820f2e990.png?v=1.0.41'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toS(){
      wx.switchTab({
        url: '/pages/MainChannel/MainChannel',
      })
    }
  }
})
