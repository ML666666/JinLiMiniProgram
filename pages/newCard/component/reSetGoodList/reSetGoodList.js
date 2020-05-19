const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: { 
    ShoppingCartExpireGoods:{
      type:Array
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
    delete(e){
      this.triggerEvent("delete", e.currentTarget)
    },
    toDetail(e){
      let id = e.currentTarget.dataset.productid;
      wx.navigateTo({
        url: '/pages/GeneralItemDescription/GeneralItemDescription?id=' + id,
      })
    },
    reget(e){
      let id = e.currentTarget.dataset.id;
      app.globalData.post('Order/ChangeShoppingCartSku', { id }).then(res=>{
        if (res.data.success=200){
          this.triggerEvent('getList', {});
        }
      })
    }
  }
})
