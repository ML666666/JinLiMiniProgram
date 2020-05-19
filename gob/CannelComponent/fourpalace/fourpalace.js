// gob/gobComponent/fourpalace/fourpalace.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    param: {
      type: Object,
      observer(val){
        this.setData({ list: val.list })
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
    toDetail(e){
      let index = e.currentTarget.dataset.index;
      this.triggerEvent('getBeClickCannelObj', { currentObj: this.data.list[index] });
    }
  }
})
