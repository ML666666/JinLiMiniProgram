const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    PickGoodObj:{
      type:Object
    },
    cardNum: {
      type: Number
    },
    detail: {
      type: Object,
      observer(val) {
        // If(8 == id){//免费领、购买
        // // 购买礼品送会员
        // }else If(9 == id){ //免费领（领取）
        // If(InviteLimitNum > InviteNum){
        // //正价购买 && 立即领取
        // }else {
        // //正价购买
        // }
        // }else if (10 == id) {//秒杀
        //   //正价购买 && 立即秒杀
        // }
        this.setData({ CanDraw:val.ActivityInfo.CanDraw })
        this.setData({ IsVip: val.ActivityInfo.IsVip})
        this.setData({ ActivityInfoType: val.ActivityInfo.Type });//活动类型
        this.setData({ ProductStatus: val.ProductStatus })
        this.setData({ FavoriteID: val.FavoriteID });
        this.getLstAttPrice(val.LstAtt)
      }
    },
    TwoPersonChipNo:{
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLstAttPrice(LstAtt) { //价格排序
      return new Promise((resolve, reject) => {
        let _LstAtt = []
        for (let v in LstAtt[0].LstAttValue) {
          for (let e in LstAtt[0].LstAttValue[v].SKU) {
            _LstAtt.push(LstAtt[0].LstAttValue[v].SKU[e]);
          }
        }
        _LstAtt.sort(function (a, b) { return a.SalePrice - b.SalePrice });
        let topPrice = this.properties.detail.ProductType == 3 ? 
                       _LstAtt[0].SalePrice:
                       _LstAtt[0].SalePrice - _LstAtt[0].ShoppingBi;
        // let lastPrice = _LstAtt[_LstAtt.length - 1].SalePrice;
        this.setData({ topPrice });
        this.setData({ topPriceNoShoppingBi: _LstAtt[0].SalePrice })
        // this.setData({ lastPrice });
        resolve(topPrice)
      })
    },
    toGoodList() {
      // console.log(this.properties.detail.Supplier);
      let Supplier = this.properties.detail.Supplier;
      let SupplierId = Supplier.SupplierId;
      let SupplierName = Supplier.SupplierName;
      let Group_id = 0;
      wx.navigateTo({
        url: `/pages/menuThree/menuThree?Group_id=${Group_id}&SupplierId=${SupplierId}&SupplierName=${SupplierName}`,
      })
    },
    isLogin(){
      if(wx.getStorageSync('userInfo')){
        return wx.getStorageSync('userInfo')
      }else{
        wx.showModal({
          title: "提示",
          content: '未登录，是否前往登录页',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({ url: '/pages/Login/Login' }) 
            }
          }
        })
        return false;
      }
    },
    toOrder(e){
    
      if (this.isLogin()){
        if (this.data.ActivityInfoType == 10 && this.data.detail.ActivityInfo.CanDraw==false) {
          wx.navigateTo({
            url: '/pages/me/page/ShareQtCode/ShareQtCode',
          })
          return
        }
        this.triggerEvent('setOrder',
          {
            type: e.target.dataset.type,
            GroupNo: this.properties.TwoPersonChipNo,
            isactive: e.currentTarget.dataset.isactive ? e.currentTarget.dataset.isactive : false  //是否地推活动0元商品
          }, {})
      }
      
    },
    Favorite(e){
      if (!this.isLogin()) {
        return
      }
      let obj = e.currentTarget.dataset;
      let favoriteid = obj.favoriteid;
      let id = this.properties.detail.Id;
      favoriteid > 0 ? this.RemoveProductFavorite(favoriteid) : this.AddProductFavorite(id)
    },
    RemoveProductFavorite(id) {
      app.globalData.post('UserCenter/RemoveProductFavorite', { favoriteID: id }).then(res => {
        if (res.data.success == 200) {
          app.globalData.toast(res.data.msg);
          this.setData({ FavoriteID: 0 })
        } else {
          wx.showModal({
            title: "提示",
            content: res.data.msg,
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({ url: '/pages/Login/Login' })
              }
            }
          })
        }
      })
    },
    AddProductFavorite(id) {
      app.globalData.post('UserCenter/AddProductFavorite', { productId: id }).then(res => {
        if (res.data.success == 200) {
          app.globalData.toast(res.data.msg);
          this.setData({ FavoriteID: res.data.favoriteId })
        } else {
          wx.showModal({
            title: "提示",
            content: res.data.msg,
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({ url: '/pages/Login/Login' })
              }
            }
          })
        }
      })
    }

  }
})
