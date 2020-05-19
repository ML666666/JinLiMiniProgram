const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    OrderListObj:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data:{

  },
  ready(){
    app.globalData.post('Paying/GetSolitairePayType',{}).then(res=>{
      this.setData({ payTypelist: res.data.list})
    })
  },
  /**
   * 组件的方法列表
   */
  methods:{
    reSetData(){
      this.triggerEvent('reSetData')
    },
    toOrderDetail(e){
      let orderid = e.currentTarget.dataset.orderid;
      wx.navigateTo({
        url: `/pages/me/page/orderList/GeneralOrderDetails/GeneralOrderDetails?orderid=${orderid}&isJL=true`,
      })
    }
  }
})
