// pages/me/page/orderList/GeneralOrderDetails/component/SpStatus/SpStatus.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj:{
      type:Object
    },
    winner:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPopup:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPopup(){
      this.setData({ showPopup: !this.data.showPopup})
    }
  }
})
