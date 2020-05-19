const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    color:{
      type:String,
      value: 'rgba(246,246,246,1)'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowHeight: app.globalData.windowHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
