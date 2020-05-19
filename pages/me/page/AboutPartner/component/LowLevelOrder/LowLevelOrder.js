Component({
  /**
   * 组件的属性列表
   */
  properties: {
    RegionalPartner:{
      type:Object
    },
    type:{
      type:Number
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
    Tclick(){
      wx.navigateTo({
        url: '/pages/me/page/AboutPartner/LowLevelOrder/LowLevelOrder?CommissionType=' + this.properties.type,
      })
    }
  }
})
