// gob/gobComponent/TopBar/TopBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    "bgColor":{
      type: String,
      value:'#ffffff'
    },
    "title":{
      type: String,
      value:'锦鲤团'
    },
    "fixed":{
      type:Boolean,
      value:true
    },
    "titleColor":{
      type:String,
      value:"#000000"
    },
    "isShowArror":{
      type: Boolean,
      value:false
    },
    "ArrowType":{
      type:Boolean,
      value:true
    },
    "custom":{
      type:Boolean,
      value:false
    },
    "customTitle":{
      type: Boolean,
      value: false
    },
    "zIndex":{
      type: Number,
      value:230
    },
    "isHideHome":{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navHeight: 0,//导航栏高度
    statusBar: 0,//状态栏高度
    _isShowArror:false
  },
  attached(){
    let pages = getCurrentPages();    //获取当前页面信息栈
    let prevPage = pages[pages.length - 2]     //获取上一个页面信息栈
    this.setData({
      navHeight: app.globalData.navHeight,//导航栏高度
      statusBar: app.globalData.statusBar,
      globaltitlelFontSize: app.globalData.globaltitlelFontSize,//状态栏高度
      _isShowArror: prevPage?true:false
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    back(){
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2];
      let currentPage = pages[pages.length - 1];
      let isMakeSureOrder = prevPage.route == 'pages/makeSureOrder/makeSureOrder' && currentPage.route != 'pages/AddAddress/AddAddress';
      wx.navigateBack({ delta: isMakeSureOrder?2:1})
    },
    toHome(){
      wx.switchTab({
        url: app.globalData.MainPageUrl,
      })
    }
  }
})
