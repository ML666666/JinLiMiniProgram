// pages/Active/component/list_bar/list_bar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fixedTop:{
      type:Number
    },
    solitaireTopData:{
      type:Object,
    },
    isRenderingPage:{
      type:Boolean,
      observer: function (res) {
        setTimeout(() => {
          this.queryMultipleNodes()
        }, 500)
      }
    },
    goodtype:{
      type:Number
      //1为免单接龙 2为幸运双拼
    },
    currentTop:{
      type:Number,
      observer:function(res){
        if (res >= this.properties.fixedTop){
          this.setData({ isFixedTop:true})
        }else{
          this.setData({ isFixedTop:false})
        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    currentIndex:0,
    fixedTop:0,
    isFixedTop:false,
    navHeight:0
  },
  attached(){
    this.setData({ navHeight: app.globalData.navHeight});
  },
  /**
   * 组件的方法列表
   */
  methods: {
    queryMultipleNodes() {
      // 获取该节点距离顶部的距离

        let _this = this;
        let activeTop = null;
        const query = wx.createSelectorQuery().in(this)
        query.select('.W_E_F').boundingClientRect(function (res) {
          activeTop = res.top - res.height;
          _this.setData({activeTop})
        }).exec();
 
    },
    changeIndex(e){
      let index = e.currentTarget.dataset.index;
      let categoryid = e.currentTarget.dataset.categoryid;
      this.triggerEvent('changeTab', { categoryid, index });
      this.setData({currentIndex:index});
    }
  }
})
