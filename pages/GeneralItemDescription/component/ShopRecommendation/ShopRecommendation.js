const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    SupplierId:{
      type:Number,
      observer(val) {
        app.globalData.post('index/getsearchproduct', { shopId: val,pagesize:3}).then(res=>{
          console.log(res.data.rows);
          this.setData({ rows: res.data.rows })
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rows:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tod(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/GeneralItemDescription/GeneralItemDescription?id='+id,
      })
    },
    togoodeList(){
      wx.navigateTo({
        url: `/pages/menuThree/menuThree?SupplierId=${this.properties.SupplierId}`,
      })
    }
  }
})
