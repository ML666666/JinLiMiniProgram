const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  pageLifetimes:{
  },
  properties: {
    CateId:{
      type:Number,
      observer(val){
        app.globalData.post('Special/MyLovePro', {
          cateid: this.properties.CateId ? this.properties.CateId : '',
          pageindex: this.data.pageindex,
          pagesize: this.data.pagesize
        }).then(res => {
          if (res.data.success == 200) {
            this.setData({ haveGet: true })
            let pageindex = this.data.pageindex + 1;
            this.setData({ pageindex, Pro: res.data.Pro })
          }
        })
      }
    },
    isReactBottom:{
      type:Number,
      observer(val) {
        if (!this.data.haveGet || this.data.isOver){
          return
        }
        app.globalData.post('Special/MyLovePro', { 
          cateid: this.properties.CateId ? this.properties.CateId:'',
          pageindex: this.data.pageindex,
          pagesize: this.data.pagesize }).then(res => {
          if (res.data.success == 200) {
            let pageindex = this.data.pageindex + 1;
            this.setData({ pageindex, Pro: [...this.data.Pro,...res.data.Pro] })
            this.setData({ isOver: res.data.Pro.length<this.data.pagesize })
          }
        })
      }
    }
  },
  attached() {
    app.globalData.post('Special/MyLovePro', {
      cateid: this.properties.CateId ? this.properties.CateId : '',
      pageindex: this.data.pageindex,
      pagesize: this.data.pagesize
    }).then(res => {
      if (res.data.success == 200) {
        this.setData({ haveGet: true })
        let pageindex = this.data.pageindex + 1;
        this.setData({ pageindex, Pro: res.data.Pro })
      }
    })   
  },
  /**
   * 组件的初始数据
   */
  data: {
    pageindex:1,
    pagesize:6,
    isOver:false,
    haveGet:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/GeneralItemDescription/GeneralItemDescription?id='+id,
      })
    }
  }
})
