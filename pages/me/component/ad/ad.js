import ZT from '../../../../gob/ZT.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array,
      observer(val){
        console.log(val);
      }
    }
  },
  methods: {
    getBeClickCannelObj(e) {
      let c = e;
      c.detail.currentObj = e.currentTarget.dataset;
      ZT(c)
    },
  }
})
