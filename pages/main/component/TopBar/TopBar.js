// pages/main/component/TopBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSpecialSellBgColor:{
      type:Boolean //是否渐变背景
    },
    specialSellBgColor:{
      type:String //渐变背景的值
    },
    targetIndex:{
      type:Number //active的Tab对应的Index
    },
    category:{
      type:Array //Tabs数值
    },
    top:{
      type:Number //距离顶部的距离
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getActiveObj(e){
      this.triggerEvent('changeTabs', e.detail,{})
    }
  }
})
