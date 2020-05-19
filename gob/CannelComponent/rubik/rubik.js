// pages/MainChannel/component/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    param: {
      type: Object,
      observer(val) {
      }
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
    click(e) {
      let index = e.currentTarget.dataset.index;
      if (!this.properties.param.list[index].jump_address){
        return
      }
      this.triggerEvent('getBeClickCannelObj', { currentObj: this.properties.param.list[index] });
    }
  }
})
