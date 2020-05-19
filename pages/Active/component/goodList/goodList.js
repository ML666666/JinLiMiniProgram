// pages/Active/component/goodList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rows:{
      type:Array
    },
    Label:{
      type:String
    },
    BtnLabel:{
      type: String
    },
    goodtype: {
      type: Number
      //1为免单接龙 3为幸运双拼
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
    toGoodDetail(e){
      let id = e.currentTarget.dataset.id
      let goodtype = this.properties.goodtype;
      wx.navigateTo({
        url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${id}&goodtype=${goodtype}`,
      })
    }
  }
})
