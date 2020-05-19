// pages/me/page/BusinessCooperation/Business/component/makeSureBtn/makeSureBtn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isDisabled:{
      type:Boolean,
      value:true
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
    tab(){
      this.triggerEvent('makeSure')
    }
  }
})
