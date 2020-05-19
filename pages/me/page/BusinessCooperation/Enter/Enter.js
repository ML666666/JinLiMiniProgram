const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  onLoad(){
    app.globalData.post('Supplier/GetRegisterRecord',{}).then(res=>{
      console.log(res.data.contact);
      this.setData({ contact: res.data.contact })
    })
  },
  data: {
    isShowMask:false,
    windowHeight: app.globalData.windowHeight
  },
  toBusiness(){
    app.globalData.toast('敬请期待');
    return
    wx.navigateTo({
      url: '/pages/me/page/BusinessCooperation/Business/enterprise_suppliers_step_1/step_1',
    })
  },
  tothreeTab(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  toRowDetail(){
    app.globalData.post('Supplier/GetRegisterRecord', {}).then(res => {
      if (res.data.list.length){
        wx.navigateTo({
          url: '/pages/me/page/BusinessCooperation/Business/ApplicationProgress/ApplicationProgress',
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '尚未查询到申请记录',
        })
      }
      // this.setData({ list: res.data.list })
    })
    // wx.navigateTo({
    //   url: '/pages/me/page/BusinessCooperation/Business/ApplicationProgress/ApplicationProgress',
    // })
  },
  isShowMask(){
    this.setData({ isShowMask: !this.data.isShowMask });
  },
  copyPhone(e){
    wx.setClipboardData({
      data: e.target.dataset.t,
    })
  }
})