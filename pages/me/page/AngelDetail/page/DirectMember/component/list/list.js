// pages/me/page/AngelDetail/page/DirectMember/image/component/list/list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    "list":{
      type:Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTarget:{},
    isPopupShow:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    CanCelStatus(){
      this.setData({ isPopupShow: !this.data.isPopupShow})
    },
    showMask(e){
      let index = e.currentTarget.dataset.index;
      console.log(this.properties.list[index]);
      this.setData({
        currentTarget:this.properties.list[index],
      })
      this.CanCelStatus();
    },
    makePhoneCall() {
      wx.makePhoneCall({
        phoneNumber: this.data.currentTarget.Phone,
      })
    },
    copyTBL() {
      if (this.data.currentTarget.WechatNumber == null) {
        app.globalData.toast('邀请人微信号为空。');
        return
      }
      wx.setClipboardData({
        data: this.data.currentTarget.WechatNumber,
      })
    }
  } 
})
