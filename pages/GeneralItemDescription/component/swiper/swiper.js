// pages/GeneralItemDescription/component/swiper/swiper.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail:{
      type: Object,
      observer(val){
        this.setData({ brandInfo:val.brandInfo },()=>{
          console.log(val.brandInfo);
        })
        this.setData({ isSellOut: val.ProductStatus!=1})
        this.setData({ VideoAddress: val.VideoAddress});
        this.setData({ FavoriteID: val.FavoriteID, list: val.ProductImg});
      }
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    FavoriteID:null,
    active:0,
    current:0,
    navHeight: app.globalData.navHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toD(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/menuThree/menuThree?brandId='+id,
      })
    },
    swiperChange(e){
      this.setData({ current: e.detail.current });
    },
    isLogin(){
      if (wx.getStorageSync('userInfo')) {
        return wx.getStorageSync('userInfo')
      } else {
        wx.showModal({
          title: "提示",
          content: '未登录，是否前往登录页',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({ url: '/pages/Login/Login' })
            }
          }
        })

        return false;
      }
    },
    changeType(e){
      // let videoplay = wx.createVideoContext('video');
      let index = e.currentTarget.dataset.index;
      this.setData({ active:index},()=>{
        console.log(this.data.active)
      })
    },  
    // Favorite(e){
    //   if (!this.isLogin()){
    //     return
    //   }
    //   let obj = e.currentTarget.dataset;
    //   let favoriteid = obj.favoriteid;
    //   let id = this.properties.detail.Id;
    //   favoriteid > 0 ? this.RemoveProductFavorite(favoriteid) : this.AddProductFavorite(id)
    // },
    // RemoveProductFavorite(id){
    //   app.globalData.post('UserCenter/RemoveProductFavorite', { favoriteID:id }).then(res=>{
    //       if(res.data.success==200){
    //         app.globalData.toast(res.data.msg);
    //         this.setData({ FavoriteID:0})
    //       }else{
    //         wx.lin.showDialog({
    //           type: "confirm",
    //           title: "提示",
    //           content: res.data.msg,
    //           success: (res) => {
    //             if (res.confirm) {
    //               wx.navigateTo({ url: '/pages/Login/Login' })
    //             }
    //           }
    //         })
    //       }
    //   })
    // },
    // AddProductFavorite(id){
    //   app.globalData.post('UserCenter/AddProductFavorite', { productId: id }).then(res => {
    //     if (res.data.success == 200) {
    //       app.globalData.toast(res.data.msg);
    //       this.setData({ FavoriteID: res.data.favoriteId })
    //     }else{
    //       wx.lin.showDialog({
    //         type: "confirm",
    //         title: "提示",
    //         content: res.data.msg,
    //         success: (res) => {
    //           if (res.confirm) {
    //             wx.navigateTo({ url: '/pages/Login/Login' })
    //           }
    //         }
    //       })
    //     }
    //   })
    // }
  }
})
