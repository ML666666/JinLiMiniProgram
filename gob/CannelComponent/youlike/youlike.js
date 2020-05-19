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
    youlike:{
      type:Object,
      observer(val){
      }
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
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/GeneralItemDescription/GeneralItemDescription?id=' + id,
      })
    }
  }
})
