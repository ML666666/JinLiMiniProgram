// pages/GeneralItemDescription/component/GoodsDirectly/GoodsDirectly.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail:{
      type:Object
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
    toGoodList(){
      // console.log(this.properties.detail.Supplier);
      let Supplier = this.properties.detail.Supplier;
      console.log(Supplier);
      let SupplierId = Supplier.SupplierId;
      let SupplierName = Supplier.SupplierName;
      let Group_id = 0;
      wx.navigateTo({
        url: `/pages/menuThree/menuThree?Group_id=${Group_id}&SupplierId=${SupplierId}&SupplierName=${SupplierName}`,
      })
    }
  }
})
