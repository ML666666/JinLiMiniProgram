const app = getApp()
export default function ZTTZ(e){
  let currentObj = e.detail.currentObj;
  let type = e.detail.currentObj.jump_type;
  if (!currentObj.jump_address) { return };
  switch (type) {
    case 0:
      break;
    case 1:
      // 专场
      wx.navigateTo({
        url: '/pages/SpecialPage/SpecialPage?SpecialAreaId=' + currentObj.jump_address,
      })
      break;
    case 2:
      if (currentObj.jump_address == 'jinlituan://JieLongProgram') {
        wx.navigateTo({url: '/pages/Active/FreeOfCharge/FreeOfCharge',})
        return 
      }
      if (currentObj.jump_address == 'jinlituan://ShuangPinProgram') {
        wx.navigateTo({url: '/pages/Active/LuckyDouble/LuckyDouble',})
        return
      } 
      // app.globalData.toast("小程序尚不支持打开该活动，请前往应用市场搜索“锦鲤团”APP")
      wx.setStorageSync('webViewUrl', currentObj.jump_address);
      wx.navigateTo({
        url: '/pages/webView/webView',
      })
      break;
    case 3:
      wx.navigateTo({
        url: `/pages/BrandGoods/BrandGoods?categoryidLst=${currentObj.jump_address}`,
      })
      break;
    case 4:
      console.log(4)

      wx.navigateTo({
        url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${currentObj.jump_address}`,
      })
      break;
    case 5:
      wx.navigateTo({
        url: '/pages/SpecialPage/SpecialPage?ActiveId=' + currentObj.jump_address,
      })
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
};