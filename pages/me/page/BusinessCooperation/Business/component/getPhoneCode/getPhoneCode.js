const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phoneNum:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timer:null,
    time:120,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getCode(){
      app.globalData.post('index/ GetCode', { type: 100, MobilePhone:this.properties.phoneNum }).then(res=>{
        if(res.data.code==200){

        }
      })
    }
  }
})
