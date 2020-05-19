let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    param: {
      type: Object,
      observer(val) {
        console.log(val);
        this.setData({ title: val.list[0].title });
        this.setData({ pic_url: val.list[0].pic_url })
        this.setData({ SpecialAreaId:val.list[0].jump_address},()=>{
          this.setData({ active:0 })
          this.setListData();
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
    active:0,
    list:[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toMore(){
      this.triggerEvent('getBeClickCannelObj', { currentObj: this.properties.param.list[0] });
    },
    toDetial(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/GeneralItemDescription/GeneralItemDescription?id=' + id,
      })
    },
    changeActive(e){
      let index = e.currentTarget.dataset.index;
      let gwb = e.currentTarget.dataset.gwb;
      this.setData({
        active:index,
      },()=>{
        this.setListData(gwb);
      })
    },
    setListData(gwb='',SpecialAreaId = this.data.SpecialAreaId){
      app.globalData.post('Special/GetSpecialAreaProduct', { SpecialAreaId, gwb, pagesize:5}).then(res=>{
        this.setData({list:res.data.Pro});
      })
    }
  }
})
