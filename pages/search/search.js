// pages/search/search.js
const app = getApp();
Page({
  data: {
    ListCannlObj:{},//列表数据频道
    isRenderingPage:true,
    refreshed:false,
    refreshing:true,
    activeindex:0
  },
  refresh(){
    this.isReFreShing();
    this.GetProductCategoryFront().then(res => {
      if (res.data.success == 200) {
        this.isReFreShing();
        this.setData({ ListCannlObj: res.data.data })
      }
    });
  },
  isReFreShing(){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing
    })
  },
  onLoad(){
    this.GetProductCategoryFront().then(res=>{
      if(res.data.success==200){
        this.isReFreShing();
        this.setData({ isRenderingPage: !this.data.isRenderingPage});
        this.setData({ ListCannlObj: res.data.data})
      }
      console.log(res.data.data);
    });
  },
  getData(e){
    this.setData({ activeindex: e.detail.obj.activeindex});
  },
  toJump(e){
    console.log(e.currentTarget.dataset);
    let type = e.currentTarget.dataset.jumptype;
    let jumpvalue = e.currentTarget.dataset.jumpvalue;
    let title = e.currentTarget.dataset.title;
    let name = e.currentTarget.dataset.name;
    console.log(name);
    switch (type) {
      case 0:
        console.log(0);
        break;
      case 1:
        // 专场
        wx.navigateTo({
          url: `/pages/SpecialPage/SpecialPage?SpecialAreaId=${jumpvalue}&name=${name}&fromSearch=true`,
        })
        break;
      case 2:
        if (jumpvalue) {
          jumpvalue== 'jinlituan://ShuangPinProgram' ? wx.navigateTo({
            url: '/pages/Active/LuckyDouble/LuckyDouble',
          }) : wx.navigateTo({
            url: '/pages/Active/FreeOfCharge/FreeOfCharge',
          })
        } else {
          wx.setStorageSync('configUrl', jumpvalue)
          wx.navigateTo({
            url: '/pages/webView/webView',
          })
        }
        break;
      case 3:
        console.log(3);
        wx.navigateTo({
          url: `/pages/BrandGoods/BrandGoods?categoryidLst=${jumpvalue}&name=${name}`,
        })
        break;
      case 4:
        console.log(4)
        wx.navigateTo({
          url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${jumpvalue}`,
        })
        break;
      case 5:
        console.log(5)
        break;
      case 6:
        console.log(6)
        break;
      case 10000:
        // 免单接龙
        wx.navigateTo({
          url: '/pages/Active/FreeOfCharge/FreeOfCharge',
        })
        break;
      case 20000:
        // 幸运双拼
        wx.navigateTo({
          url: '/pages/Active/LuckyDouble/LuckyDouble',
        })
        break;
      default:
        // 商品详情
        let id = currentObj.product_id;
        wx.navigateTo({
          url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${id}`,
        })
        break;
    }
  },
  GetProductCategoryFront(){
    return app.globalData.post('Product/GetProductCategoryFront',{})
  }
})