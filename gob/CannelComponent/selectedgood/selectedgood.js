Component({
  /**
   * 组件的属性列表
   */
  properties: {
    param: {
      type: Object,
    },
    imgDomain: {
      type: String
    },
    imgVersion: {
      type: String
    },
    NowData: {
      type: Number
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
    click(e){
      let index = e.currentTarget.dataset.index;
      let obj = this.properties.param.list[index];
      wx.navigateTo({
        url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${obj.product_id}`,
      })
      // this.triggerEvent('getBeClickCannelObj', { currentObj: obj });
    }
  }
})
