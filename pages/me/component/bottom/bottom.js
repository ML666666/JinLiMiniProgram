const app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    BottomInfo:{
      type:Object,
      observer(t){
        console.log(t);
        this.setData({ Status: t })
        this.setData({ RegionInCome: t.RegionInCome ? t.RegionInCome : null });
        this.setData({ SpecialInCome: t.SpecialInCome ? t.SpecialInCome : null });
      }
    }
  },
  // attached() {
  //   app.globalData.post('UserCenter/StatisticsAgentOrderInCome',{}).then(res=>{
  //     let t  =  res.data.data;
  //     this.setData({ Status:t })
  //     this.setData({ RegionInCome: t.RegionInCome ? t.RegionInCome:null });
  //     this.setData({ SpecialInCome: t.SpecialInCome ? t.SpecialInCome:null });
  //   })
  // },
  /**
   * 组件的初始数据
   */
  data: {
    z_url: baseUrl +'upload/Picture/comment/201911/eb582e59f62947a3a56ff41188474e12.png?v=1.0.41',
    h_url: baseUrl +'upload/Picture/comment/201911/107fc5fe34f7443bbe183d895647efb7.png?v=1.0.41'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toChengshi(){
      wx.navigateTo({
        url: '/pages/me/page/AboutPartner/AreaPartner/AreaPartner?AgentLevel=' + this.data.Status.AgentLevel,
      })
    },
    toTY(){
      wx.navigateTo({
        url: '/pages/me/page/AboutPartner/SpPartner/SpPartner',
      })
    }
  }
})
