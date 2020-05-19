// pages/Active/FreeOfCharge/component/aboutMe/component/MyGoldCoinRecord/MyGoldCoinRecord.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    MyGoldCoin:{
      type:Object,
      observer: function (val) {
        console.log(val.OrderList);
      }
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

  }
})
