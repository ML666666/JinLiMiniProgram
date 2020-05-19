const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cannalObj:{
      type:Object, //特卖非列表数据
      observer(val){
        // console.log(val)
      }
    },
    list:{
      type:Array, //特卖列表数据
      observer(val) {
        // console.log(val)
      }
    },
    isAutoPlay:{
      type:Boolean, //
      observer(val) {
        // console.log(val)
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    specialSellBgColor:null, //当前ActiveSwiper对应的渐变色
    swiperIndex:null, //当前Swiper的ActiveIndex
  },
  ready(){
    this.queryMultipleNodes()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 前往商品详情
    toGoodDetail(e) {
      wx.navigateTo({
        url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${e.currentTarget.dataset.id}`
      })
    },
    navigation(e) {
      let obj = e.currentTarget.dataset;
      let categoryid = obj.categoryid;
      let specialareatype = obj.specialareatype;
      let title = obj.title;
      let type = obj.type;
      switch (specialareatype) {
        case 0:
          wx.navigateTo({
            url: `/pages/TypeList/TypeList?categoryid=${categoryid}&type=${type}&title=${title}`,
          })
          //跳转到分类页 如今日特卖,果蔬生鲜,进口商品
          break;
        case 1:
          wx.navigateTo({
            url: `/pages/Active/FreeOfCharge/FreeOfCharge`,
          })
          break;
        case 2:
          wx.navigateTo({
            url: `/pages/Active/LuckyDouble/LuckyDouble`,
          })
          break;
      }
    },
    queryMultipleNodes() {
      // 获取该节点距离顶部的距离
      let _this = this;
      const query = wx.createSelectorQuery().in(this)
      query.select('.genuine_1').boundingClientRect(function (res) {
        let activeTop = res.top * app.globalData.rpxTopx;
        // 获取后通知父组件
        _this.triggerEvent('getActiveTop',{activeTop});
      }).exec()
    },
    //SwiperChange时触发该页面
    swiperChange(index){
      let color = this.properties.cannalObj.broadcastAd[index.detail.current].BackgroundColor;
      this.setData({ specialSellBgColor: color, swiperIndex: index.detail.current });
      this.triggerEvent('swiperChange', { specialSellBgColor: color},{});
    },
    toMore(){
      let cannelObj = this.data.cannalObj.navigationIcoAd.find((item) => { return item.SpecialAreaType == 0 });
      wx.navigateTo({
        url: `/pages/TypeList/TypeList?categoryid=${cannelObj.CategoryID}&type=${cannelObj.Type}&title=${cannelObj.Desc}`,
      })
    }
  }
})
