
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    param: {
      type: Object,
      observer(val){
       
        let GoodList = val.list;
        let TopBanner = val.list.shift();
        let k = 0;
        for (let i = 0; i < GoodList.length;i++){
          GoodList[i].end_time != ""
          GoodList[i].start_time != ""
          GoodList[i].jump_address = GoodList[i].jump_address ? GoodList[i].jump_address:val.jump_address;
          if (!this.isOpen(GoodList[i])){
            k++;
          }
        }
        console.log(GoodList);
        console.log(TopBanner);
        k == GoodList.length?this.setData({isOver:true}):
        this.setData({ TopBanner, GoodList, isOver: false, jump_type: val.jump_type});
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
    isOpen(item){

      if (item.start_time == "" && item.end_time == "") {
        return true
      }
      if (item.start_time == "" && item.end_time != "") {
        return Date.parse(this.data.NowData) < Date.parse(item.end_time);
      }
      if (item.start_time != "" && item.end_time != "") {
        return Date.parse(this.data.NowData) > Date.parse(item.start_time) && 
        Date.parse(this.data.NowData) < Date.parse(item.end_time);
      }
      if (item.start_time != "" && item.end_time == "") {
        return Date.parse(this.data.NowData) > Date.parse(item.start_time);
      }

    },
    click(e){
      let index = e.target.dataset.index;
      let obj = this.data.GoodList[index];
      // console.log(this.data.GoodList[index]);
      // return
      // obj.jump_type = this.data.jump_type;
      this.triggerEvent('getBeClickCannelObj', { currentObj: obj });
    },
    clickTop(e){
      this.triggerEvent('getBeClickCannelObj', { currentObj: this.data.TopBanner });
    }
  }
})
