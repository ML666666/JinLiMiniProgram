
const watch = require("../../../utils/watch.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    refreshed:{ //是否停止Loading
      type:Boolean
    },
    refreshing:{ //是否正在Loading
      type:Boolean
    },
    isRenderingPage:{
      type:Boolean //是否已加载全部数据并可显示视图
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  ready(){
    // setTimeout(()=>{
    //   let val = this.data.$state.isGetDataFail;
    //   Object.defineProperty(this.data.$state, 'isGetDataFail', {
    //     configurable: true,
    //     enumerable: true,
    //     set: function (value) {
    //       val = value;
    //       _this.watchIsGetDataFail();
    //     },
    //     get: function () {
    //       return val;
    //     }
    //   })
    // },500)
  },
  pageLifetimes:{
    show:function(){
      let val = this.data.$state.isGetDataFail;
      let _this = this;
      Object.defineProperty(this.data.$state, 'isGetDataFail', {
        configurable: true,
        enumerable: true,
        set: function (value) {
          val = value;
          _this.watchIsGetDataFail();
        },
        get: function () {
          return val;
        }
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    regetError(){
      let _this = this;
      wx.getNetworkType({
        success: function (res) {
          if (res.networkType == 'none'){
            getApp().globalData.toast('当前无网络！')
          }else{
            _this.getPage().setData({ refreshed: true, refreshing: false })
            _this.getPage().refresh();
            _this.getPage().setData({ isRenderingPage: false })
          }
        }
      })

      // this.getPage().refresh();
    },
    watchIsGetDataFail(){
      if (this.data.$state.isGetDataFail){
        this.getPage().setData({refreshed:true,refreshing:false})
      }
    },
    refresh(){
      this.triggerEvent('refresh',{});
    },
    getPage(){
      const pages = getCurrentPages();
      const perpage = pages[pages.length - 1];
      return perpage;
    }
  }
})
