// pages/me/page/AboutPartner/component/Titie/Title.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    t:{
      type:String,
      value:'更多'
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
    click() { //pages/me/page/AboutPartner/LowLevelOrder/LowLevelOrder
      this.triggerEvent('Tclick',{})
    }
  }
})
