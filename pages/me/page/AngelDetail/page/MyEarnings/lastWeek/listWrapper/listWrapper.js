





const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userData:{
      type:Object
    },
    isReachBottom: {
      type: Number,
      observer(val) {
        if (this.data.active == 1){
          let GetLsLastWeekAgentPer = this.data.GetLsLastWeekAgentPer;
          let pageIndex = GetLsLastWeekAgentPer.pageIndex+1;
          if (GetLsLastWeekAgentPer.isOver){
            return
          }
          this.GetLsLastWeekAgentPerformance(pageIndex).then(res => {
            console.log(GetLsLastWeekAgentPer)
            GetLsLastWeekAgentPer.list = [...GetLsLastWeekAgentPer.list,...res.data.list]
            GetLsLastWeekAgentPer.pageIndex = pageIndex;
            res.data.list.length < this.data.pageSize ?
                    GetLsLastWeekAgentPer.isOver = true : 
                          GetLsLastWeekAgentPer.isOver = false;
            this.setData({ GetLsLastWeekAgentPer })

          })
        }else{
          let GetLastWeekAgentObj = this.data.GetLastWeekAgentObj;
          let pageIndex = GetLastWeekAgentObj.pageIndex + 1;
          if (GetLastWeekAgentObj.isOver) {
            return
          }
          this.GetLsLastWeekAgentPerformance(pageIndex).then(res => {
            GetLastWeekAgentObj.list = [...GetLastWeekAgentObj.list, ...res.data.list]
            GetLastWeekAgentObj.pageIndex = pageIndex;
            res.data.list.length < this.data.pageSize ?
              GetLastWeekAgentObj.isOver = true :
              GetLastWeekAgentObj.isOver = false;
            this.setData({ GetLastWeekAgentObj })
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
    pageSize:10,
    GetLastWeekAgentObj:{},
    GetLsLastWeekAgentPer:{},
    PageIndex: 1,
    PageSize: 10
  },
  lifetimes: {
    attached() {
      this.GetLastWeekAgentIncome().then(res=>{
        let GetLastWeekAgentObj = Object.assign(res.data, { pageIndex: 1, isOver: res.data.list.length<this.data.pageSize?true:false})
        this.setData({ GetLastWeekAgentObj },()=>{
          console.log(GetLastWeekAgentObj);
        })
      });
      this.GetLsLastWeekAgentPerformance().then(res=>{
        let GetLsLastWeekAgentPer = Object.assign(res.data, { pageIndex: 1, isOver: res.data.list.length < this.data.pageSize ? true : false })
        this.setData({ GetLsLastWeekAgentPer },()=>{
          console.log(this.data.GetLsLastWeekAgentPer)
        })
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    setActive(e){
      let active = e.currentTarget.dataset.index
      this.setData({ active });
    },
    GetLastWeekAgentIncome(PageIndex=1){
      return app.globalData.post('Agent/GetLastWeekAgentIncome', { PageIndex, PageSize: this.data.PageSize})
    },
    GetLsLastWeekAgentPerformance(PageIndex=1){
      return app.globalData.post('Agent/GetLsLastWeekAgentPerformance', { PageIndex, PageSize: this.data.PageSize})
    }
  }
})
