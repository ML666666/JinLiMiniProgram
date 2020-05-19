
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    param: {
      type: Object,
      observer(val){
        this.setData({ type: val.style },()=>{
          if (val.style == 0 || val.style == 1){
            this.setData({ list: [...val.list]})
          }
          if (val.style == 2) {
            let list = val.list;
            let topBanner = list.shift();
            console.log(list);
            this.setData({topBanner,list})
          }
        });
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    click(e){
      let index = e.currentTarget.dataset.index;
      this.triggerEvent('getBeClickCannelObj', { currentObj: this.data.list[index] });
    }
  }
})
