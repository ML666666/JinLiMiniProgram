const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    CanCelStatus(e) {
      let orderId = e.currentTarget.dataset.orderid;
      app.store.setState({ SocketObj: {Code: -1}});
      wx.sendSocketMessage({ data: JSON.stringify({ ObjId: orderId, Data: { Code: 1003 }}) }); //想服务器发送OrderId表明用户已知悉结果
    },
    toDetail(e){
      this.CanCelStatus(e);
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/GeneralItemDescription/GeneralItemDescription?goodtype=2&id=${id}`,
      })

    },
    toOrderPage(e){
      this.CanCelStatus(e);
      let type = e.currentTarget.dataset.type;
      type == 0 ? wx.navigateTo({
        url: '/pages/Active/LuckyDouble/LuckyDouble',
      }):wx.navigateTo({
        url: '/pages/me/page/RemainingSum/RemainingSum',
      })
    }
  }
})
