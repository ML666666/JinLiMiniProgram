const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  lifetimes:{
    attached: function(){
      this.setData({ navHeight: app.globalData.navHeight});
      this.setData({ statusBar: app.globalData.statusBar});
      this.setData({ globaltitlelFontSize: app.globalData.globaltitlelFontSize});
      setTimeout(()=>{
        var query = wx.createSelectorQuery()//创建节点查询器 query
        query.select('.wrapper').boundingClientRect((r)=>{
         
        })//这段代码的意思是选择Id=the-id的节点，获取节点位置信息的查询请求
        query.selectViewport().scrollOffset()//这段代码的意思是获取页面滑动位置的查询请求
        query.exec(function (res) {
         
        })
      },500)

      // var query = wx.createSelectorQuery();
      // var that = this;
      // query.select('.wrapper').boundingClientRect(function (rect) {
      //   console.log(rect);
      //   that.setData({
      //     height: rect.width + 'px'
      //   })
      // }).exec();

      this.getNoReadNum();

    }
  },
  ready:function(){
  },
  properties: {
    isSpecialSellBgColor:{
      type:Boolean,
      value:true
    },
    GetChannelLst:{
      type:Array
    },
    hotKeyWord:{
      type:Array,
      observer(val){
   
      }
    }
  },
  pageLifetimes:{
    show: function () {
      this.getNoReadNum();
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    navHeight:null,
    statusBar:null,
    globaltitlelFontSize:null,
    msgList:[],
    targetIndex:1,
    noReadNum:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getNoReadNum(){
      this.GetMyMessageLstGroup().then(res => {
        res.data.success == 200 ? this.setData({ login: true, msgList: res.data.list }) : this.setData({ login: false });
        let noReadNum = 0;
        for (let i in res.data.list) {
          noReadNum += res.data.list[i].noReadNum;
        }
        this.setData({ noReadNum });
      })
    },
    toSearch(){
      wx.navigateTo({
        url: '/pages/search/SearchResult/SearchResult',
      })
    },
    GetMyMessageLstGroup(){
      return app.globalData.post('Account/GetMyMessageLstGroup',{})
    },
    toMsg() {
      !this.data.login ? wx.showModal({
        title: "提示",
        content: "请先登录",
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/Login/Login',
            })
          }
        }
      }) : wx.navigateTo({
        url: '/pages/search/MessageQueue/MessageQueue',
      })
    },
  }
})
