// pages/GeneralItemDescription/component/specifications/specifications.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail:{
      type:Object
    }
  },
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    toOrder(e) {
      this.triggerEvent('setOrder', { type:1 }, {})
    }
  }
})
