const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  lifetimes: {
    attached: function (val) {
      app.globalData.post("/Platform/GetFloatingPoint",{}).then(res=>{
        this.setData({ dotObj: res.data.lst[0] });
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dotObj:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail(){
      this.triggerEvent('getBeClickCannelObj', { currentObj: {
        jump_type: this.data.dotObj.JumpType,
        jump_address:this.data.dotObj.JumpContent}
      });
    }
  }
})
