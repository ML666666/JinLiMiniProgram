// pages/me/page/orderList/Comment/Comment.js
const gob = require('../../../../../../gob/gob.js');
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    AgentObj:{
      type:Object,
      observer(val){
        console.log(val);
        this.setData({
          Phone: val.Phone,
          QRCodeUrl: val.QRCodeUrl,
          RealName: val.RealName,
          WechatNumber: val.WechatNumber
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    RealName:null,
    Phone:null,
    WechatNumber:null,
    QRCodeUrl:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    input(e){
      let name = e.currentTarget.dataset.name;
      let value = e.detail.value;
      let obj = {};
      obj[name] = value
      this.setData(obj);
    },
    cancel(){
      this.triggerEvent('cancel',{})
    },
    addImg(){
      let _this = this;
      wx.chooseImage({
        count: 1,
        success: function (res) {
          var tempFilePaths = res.tempFilePaths[0];
          let baseUrl = gob.default.config.baseUrl;
          wx.uploadFile({
            url: `${baseUrl}UpLoad/Img`,
            filePath: tempFilePaths,
            name: 'file',
            formData: {
              dir: 0,
              token: wx.getStorageSync('token')
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success(res) {
              if (JSON.parse(res.data).success == 200) {
                _this.setData({ imgUrl: JSON.parse(res.data).paths[0] })
                _this.setData({ QRCodeUrl: JSON.parse(res.data).paths[0]})
              } else {
                app.globalData.toast(res.data.msg);
              }
            }
          })
        },
      })
    },
    MakeSure(){
      
      if (!this.data.RealName){
        app.globalData.toast('请输入姓名')
        return
      }
      if (!this.data.Phone){
        app.globalData.toast('请输入手机号')
        return
      }
      if (!this.data.WechatNumber){
        app.globalData.toast('请输入微信号')
        return
      }
      if (!this.data.QRCodeUrl){
        app.globalData.toast('请上传微信二维码')
        return
      }
      let obj = {
        Phone: this.data.Phone,
        QRCodeUrl: this.data.QRCodeUrl,
        RealName: this.data.RealName,
        WechatNumber: this.data.WechatNumber
      }
      app.globalData.post('Agent/UpdateAgent', obj).then(res=>{
        app.globalData.toast(res.data.msg);
        res.data.success==200?this.cancel():null
      })
    }
  }
})
