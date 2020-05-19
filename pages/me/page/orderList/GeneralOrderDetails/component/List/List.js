// pages/me/page/orderList/GeneralOrderDetails/component/List/List.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj:{
      type:Object
    },
    isSp:{
      type:Boolean
    },
    isJL:{
      type:Boolean
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
    getBackMoney(e){
      let productid = e.currentTarget.dataset.productid;
      let orderid = e.currentTarget.dataset.orderid;
      let orderitemid = e.currentTarget.dataset.orderitemid;
      wx.navigateTo({
        url: `/pages/me/page/orderList/SalesReturnApplyFor/SalesReturnApplyFor?productid=${productid}&orderid=${orderid}&orderitemid=${orderitemid}`,
      })
    },
    toGoodDetail(e) {
      let goodtype = 0;
      if (this.properties.isSp){
        goodtype = 2;
      }
      if (this.properties.isJL){
        goodtype = 3;
      }
      wx.navigateTo({
        url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${e.currentTarget.dataset.productid}&goodtype=${goodtype}`,
      })
    }
  }
})
