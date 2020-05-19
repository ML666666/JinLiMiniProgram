// pages/GeneralItemDescription/component/swiper/t_swiper/t_swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array
    },
    VideoAddress:{
      type:String
    },
    active:{
      type:Number,
      observer(val){
        this.setData({ current: val });
      }
    },
    detail: {
      type: Object,
      observer(val){
        console.log(val)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current:0,
    isAutoplay:false,
    isPlaying:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    stopVa() {
      let v = wx.createVideoContext('video', this);
      this.setData({ isPlaying: !this.data.isPlaying},()=>{
        this.data.isPlaying ? v.pause() : v.play()
      })
    },
    swiperChange(e){
      this.setData({ current:e.detail.current},()=>{
        let v = wx.createVideoContext('video', this);
        if (this.properties.VideoAddress && this.data.current>0){
          v.pause();
        }
      });
      this.triggerEvent('swiperChange', { current: e.detail.current },{})
    }
  }
})
