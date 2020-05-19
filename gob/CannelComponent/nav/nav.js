// pages/MainChannel/component/nav/nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    param: {
      type: Object,
      observer(val){
        let pageIndex = null;
        let kList = val.list;
        let list = [];
        for(let i=0; i<kList.length;i++){
          if (this.properties.NowData > Date.parse(kList[i].start_time) && this.properties.NowData < Date.parse(kList[i].end_time)) {
            list.push(kList[i]);
          }
        }
        let secondArray = [];

        if (list.length % 10 && list.length>10){
          pageIndex = parseInt(list.length / 10) + 1;
          let _Tindex = 0;
          for (let i = 0; i < pageIndex;i++){secondArray[i] = [];}
          for(let i = 0; i<list.length;i++){
            secondArray[_Tindex].length == 10 ? _Tindex++ : null;
            secondArray[_Tindex].push(list[i]);
          }
        }else{
          pageIndex = 1;
          secondArray = val.list[0] instanceof Array ? val.list[0]:val.list;
        }

        this.setData({ pageIndex, secondArray })
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
    activeIndex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    swiper(e){
      this.setData({ activeIndex:e.detail.current });
    },
    click(e){
      if (this.data.pageIndex==1){
        let index = e.currentTarget.dataset.index;
        let secondArray = this.data.secondArray;
        // console.log(secondArray)
        this.triggerEvent('getBeClickCannelObj', { currentObj: secondArray[index] });
      
      }else{
        let index = e.target.dataset.index;
        let TIndex = e.target.dataset.tindex;
        this.triggerEvent('getBeClickCannelObj', { currentObj: this.data.secondArray[index][TIndex] });

      }
    }
  }
})
