// pages/MainChannel/component/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    param:{
      type:Object,
      observer(val) {
        this.setData({ activeindex:0 })
      }
    },
    imgDomain:{
      type:String
    },
    imgVersion:{
      type:String
    },
    NowData:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeindex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click(e){
      let index = e.target.dataset.index;
      this.triggerEvent('getBeClickCannelObj', { currentObj: this.properties.param.list[index]});
    }
  }
})
