const app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notPassUrl: baseUrl +'upload/Picture/comment/201910/7954e75675c14971a9affc51198b9aa0.png?v=1.0.41',
    PassingUrl: baseUrl + 'upload/Picture/comment/201910/f4ffc010c20a4c72a9bf411adfb6770b.png?v=1.0.41',
    havePassing: baseUrl +'upload/Picture/comment/201910/33d973a391854698b3fdc9879fa685dd.png?v=1.0.41'


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(){
    app.globalData.post('Supplier/GetRegisterRecord', {}).then(res => {
      console.log(res.data.list);
      this.setData({ list: res.data.list })
    })
  },
  // onLoad: function (options) {
  //   app.globalData.post('Supplier/GetRegisterRecord', {}).then(res=>{
  //     console.log(res.data.list);
  //     this.setData({ list:res.data.list})
  //   })
  // },
  getMerchantCode(){
    wx.navigateTo({
      url: '/pages/me/page/BusinessCooperation/Business/getMerchantCode/getMerchantCode',
    })
  },
  toCheckStatus(e){
  
    let type = e.currentTarget.dataset.type;
    let applystatus = e.currentTarget.dataset.applystatus;
    let applyid = e.currentTarget.dataset.applyid;
    let isShowData = (applystatus != 1 && applystatus != 3) || applystatus==3;
    let isEditData = (applystatus == 3);
    console.log(applyid);
    switch (type) {
      case 100: //个体工商户
        wx.navigateTo({
          url: `/pages/me/page/BusinessCooperation/Business/individualbusiness/individualbusiness?isShowData=${isShowData}&isEditData=${isEditData}&applyid=${applyid}`
        });
        break;
      case 101: //企业代理商
        wx.navigateTo({
          url: `/pages/me/page/BusinessCooperation/Business/CorporateAgents/CorporateAgents?isShowData=${isShowData}&isEditData=${isEditData}&applyid=${applyid}`
        });
        break;
      case 102: //个人门店
        wx.navigateTo({
          url: `/pages/me/page/BusinessCooperation/Business/PersonalStores/PersonalStores?isShowData=${isShowData}&isEditData=${isEditData}&applyid=${applyid}`
        })
        break;
    }
  }
})