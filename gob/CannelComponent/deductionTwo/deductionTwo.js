// pages/MainChannel/component/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    param: {
      type: Object,
      observer(val) {
        console.log|(val);
        this.setData({ jumpObj:val });
        this.setData({ pic_url: val.list[0].pic_url})
        this.setData({ retData:val.list[0].retData });
        // this.setData({ list: val.list[0].retData.Pro.slice(0,3)})
        this.setData({ list: val.list[0].retData.Pro.slice(0, 3).map((item)=>{
          item['tprice'] = (item.SalePrice - item.ShoppingBi).toFixed(2)
          return item
        }) },()=>{
          console.log(this.data.list);
        })
      }
    },
    imgDomain: {
      type: String
    },
    imgVersion: {
      type: String
    },
    NowData: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeindex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail(e){
      // let id = e.currentTarget.dataset.id;
      // wx.navigateTo({
      //   url: `pages/GeneralItemDescription/GeneralItemDescription?id=${id}`
      // })
      this.triggerEvent('getBeClickCannelObj', { currentObj:this.data.jumpObj.list[0] });
    }
  }
})
