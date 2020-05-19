const app = getApp()
let timer = null;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    SocketObj:{
      type:Object,
      observers(val){
        console.log(val);
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  attached(){
    // setInterval(()=>{
    //   // console.log(this.properties.$state.SocketObj);
    // },1000);
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    // show: function () { timer = "show"; console.log(timer) },
    // hide: function () { timer = "hide"; console.log(timer) },
    // resize: function () { },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    CanCelStatus(){
      app.store.setState({
        TestSocketObj: {
          Code:-1
        }
      });
    }
  }
})
