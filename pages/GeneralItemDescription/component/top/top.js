// pages/GeneralItemDescription/component/top/top.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  attached(){
    this.setData({
      navHeight: app.globalData.navHeight,//导航栏高度
      statusBar: app.globalData.statusBar,
      globaltitlelFontSize: app.globalData.globaltitlelFontSize//状态栏高度
    })
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    navHeight: 0,//导航栏高度
    statusBar: 0,//状态栏高度
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
