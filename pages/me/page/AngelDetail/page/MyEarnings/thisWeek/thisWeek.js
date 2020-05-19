const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  lifetimes: {
    attached() {
      let one = app.globalData.post('Agent/GetThisWeekTotalPerformance', {});
      let two = app.globalData.post('Agent/GetThisWeekDirectlyTotalPerformance', {});
      let three = app.globalData.post('Agent/GetThisWeekAgentTotalPerformance', { 
        PageIndex: this.data.DlistObj.PageIndex, 
        PageSize:this.data.DlistObj.PageSize
      });
      let four = app.globalData.post('Agent/GetLsThisWeekAgentPerformance',{
        PageIndex: this.data.ZTlistObj.PageIndex,
        PageSize: this.data.ZTlistObj.PageSize
      })
      Promise.all([one, two, three, four]).then(res=>{
        this.setData({ _obj: res[1].data.data});
     
        this.setData({ userData: Object.assign(res[0].data.data, res[1].data.data, res[2].data) },()=>{
          let DlistObj = this.data.DlistObj;
          DlistObj.list = res[2].data.list;
          DlistObj.isOver = DlistObj.PageSize>res[2].data.list.length;
          this.setData({ DlistObj});

          let ZTlistObj = this.data.ZTlistObj;
          ZTlistObj.list = res[3].data.list;
          ZTlistObj.isOver = ZTlistObj.PageSize > res[3].data.list.length;
          this.setData({ ZTlistObj }, () => { console.log(this.data.ZTlistObj)});

        })
      })
    },
  },
  properties: {
    isReachBottom:{
      type: Number,
      observer(val) {
        if(this.data.active==1){
          let ZTlistObj = this.data.ZTlistObj;
          let PageIndex = ZTlistObj.PageIndex + 1;
          app.globalData.post('Agent/GetLsThisWeekAgentPerformance', {
            PageIndex,
            PageSize: this.data.ZTlistObj.PageSize
          }).then(res => {
            ZTlistObj.list = [...ZTlistObj.list, ...res.data.list];
            ZTlistObj.isOver = ZTlistObj.PageSize > res.data.list.length;
            ZTlistObj.PageIndex = PageIndex;
            this.setData({ ZTlistObj })
          })
        }
        if (this.data.active==2){
          let DlistObj = this.data.DlistObj;
          let PageIndex = DlistObj.PageIndex+1;
          app.globalData.post('Agent/GetThisWeekAgentTotalPerformance', {
            PageIndex,
            PageSize: this.data.DlistObj.PageSize
          }).then(res=>{
            DlistObj.list = [...DlistObj.list, ...res.data.list];
            DlistObj.isOver = DlistObj.PageSize > res.data.list.length;
            DlistObj.PageIndex = PageIndex;
            this.setData({ DlistObj})
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active:1,
    userData:{},
    DlistObj:{
      list:[],
      PageIndex: 1,
      PageSize: 10,
      isOver:false
    },
    ZTlistObj:{
      list: [],
      PageIndex: 1,
      PageSize: 10,
      isOver: false
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setActive(e) {
      let active = e.currentTarget.dataset.index
      this.setData({ active });
    },
  }
})
