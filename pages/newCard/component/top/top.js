





    const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  attached() {
    let pages = getCurrentPages();    //获取当前页面信息栈
    let prevPage = pages[pages.length - 2]     //获取上一个页面信息栈
    this.setData({
      _isShowArror: prevPage ? true : false
    })
  },
  properties: {
    cardData:{
      type:Array
    },
    isShowArror:{
      type:Boolean
    },
    timestamp:{
      type:Number,
      observer(val){
        this.setData({ EndTime : val },()=>{
          if (this.data.EndTime){
            clearInterval(this.TsetInterval);
            this.countDownd();
            this.TsetInterval = setInterval(() => {this.countDownd();}, 1000)
          }
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navHeight: app.globalData.navHeight,
    statusBar: app.globalData.statusBar,
    TsetInterval:null,
    isShowMask:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backC(){
      wx.navigateBack({ changed: true });
    },
    toHome(){
      wx.switchTab({
        url: '/pages/MainChannel/MainChannel',
      })
    },
    isShowMaskFn(){
      this.setData({ isShowMask: !this.data.isShowMask });
    },
    countDownd(EndTime = this.data.EndTime){
      let Days = parseInt(EndTime / 1000 / 60 / 60 / 24, 10); //计算剩天
      let Hours = parseInt(EndTime / 60 / 60 % 24, 10); //计算剩余的小时
      let Minutes = parseInt(EndTime / 60 % 60, 10); //计算剩余的分钟
      let Seconds = parseInt(EndTime % 60, 10); //计算剩余的秒数
      this.setData({ EndTime: EndTime - 1, Minutes, Seconds},()=>{

        if(this.data.EndTime==0){
          console.log('reSetList')
          setTimeout(()=>{
            this.triggerEvent('reSetList', {});
          },1000)
          clearInterval(this.TsetInterval);
        }
      });
    }
  }
})
