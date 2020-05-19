const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  lifetimes:{
    attached(){
      app.globalData.post('/Agent/GetLastWeekTotalIncome',{}).then(res=>{
        this.setData({ userData:res.data.data });
      })
    },
  },
  properties: {
    isReachBottom: {
      type: Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userData:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
