// pages/Active/FreeOfCharge/component/aboutMe/component/userInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    member:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    GoldCoin:false,
    ShoppingValue:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeGoldCoin(){
      this.setData({ GoldCoin: !this.data.GoldCoin});
    },
    changeShoppingValue() {
      this.setData({ ShoppingValue: !this.data.ShoppingValue });
    }
  }
})
