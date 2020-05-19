// pages/index/indexPage/specialSell/specialSell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderCannal:{type:Object},
    orderCannal_2:{ type: Object },
    isWaterfall:{ type:Boolean }  //是否双拼瀑布流
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
    toGoodDetail(e) {
      wx.navigateTo({
        url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${e.currentTarget.dataset.id}`,
      })
    },
  }
})
