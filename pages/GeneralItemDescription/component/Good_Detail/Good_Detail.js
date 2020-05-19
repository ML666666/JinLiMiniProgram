// pages/GeneralItemDescription/component/Good_Detail/Good_Detail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    PickGoodObj:{
      type:Object
    },
    detail:{
      type: Object,
      observer(obj){
        console.log(obj.PriceRange);
        let IsAngel = wx.getStorageSync('IsAngel');
        this.setData({
          count: (obj.SalePrice - obj.MemberPrice).toFixed(2),
          IsAngel: IsAngel
        })
        let SalePrice = obj.SalePrice
        if (obj.LstAtt.length){
          this.getLstAttPrice(obj.LstAtt).then((SalePrice)=>{
            this.setData({ TheCount: ((SalePrice / obj.MarketPrice) * 10).toFixed(1) })
          })
        }else{
          this.setData({ TheCount: ((SalePrice / obj.MarketPrice) * 10).toFixed(1) })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLstAttPrice(LstAtt) { //价格排序
      return new Promise((resolve,reject)=>{
        let _LstAtt = []
        for (let v in LstAtt[0].LstAttValue) {
          for (let e in LstAtt[0].LstAttValue[v].SKU) {
            _LstAtt.push(LstAtt[0].LstAttValue[v].SKU[e]);
          }
        }
        _LstAtt.sort(function (a, b) { return a.SalePrice - b.SalePrice });
        let topPrice = _LstAtt[0].SalePrice;
        let lastPrice = _LstAtt[_LstAtt.length - 1].SalePrice;
        this.setData({ topPrice });
        this.setData({ lastPrice });
        resolve(topPrice)
      })
    },
    toAngel(){
      if (this.data.IsAngel){
        return
      }
      wx.navigateTo({
        url: '/pages/AngelGiftBag/AboutAngel/AboutAngel',
      })
    }
  }
})
