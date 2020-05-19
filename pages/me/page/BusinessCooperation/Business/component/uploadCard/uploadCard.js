const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    front:{
      type:String,
      observer(val){
        console.log(val);
        this.setData({ zm:val})
      }
    },
    verso:{
      type:String,
      observer(val) {
        console.log(val);
        this.setData({ fm:val })
      }
    }
  },
  attached(){
    this.setData({ token:wx.getStorageSync('token')})
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
    close(e){
      let item = e.currentTarget.dataset.index;
      let obj = [];
      obj[item] = '';
      item == 'zm' ?
        this.triggerEvent('getCardImage', { BusinessIdentityCardImage_front: '' }) :
        this.triggerEvent('getCardImage', { BusinessIdentityCardImage_verso: '' })
      this.setData(obj)
    },
    addImg(e) {
      let item = e.currentTarget.dataset.index;
      let _this = this;
      wx.chooseImage({
        count: 1,
        success: function (res) {
          var tempFilePaths = res.tempFilePaths[0];
          let baseUrl = app.globalData.gob.config.baseUrl;
          wx.uploadFile({
            url: `${baseUrl}UpLoad/Img?token=` + _this.data.token,
            filePath: tempFilePaths,
            name: 'file',
            formData: {
              dir: 1,
              client:3,
              token: _this.data.token
            },
            header: {
              "Content-Type": "multipart/form-data;charset=utf-8"
            },
            success(res) {
              if (JSON.parse(res.data).success == 200) {
                // console.log(JSON.parse(res.data).paths[0]);
                let obj = [];
                obj[item] = JSON.parse(res.data).paths[0];
                _this.setData(obj);
                item == 'zm' ? 
                  _this.triggerEvent('getCardImage', { BusinessIdentityCardImage_front: JSON.parse(res.data).paths[0] }) :                        _this.triggerEvent('getCardImage', { BusinessIdentityCardImage_verso: JSON.parse(res.data).paths[0] })
                } else {
                console.log(1)
                app.globalData.toast(res.data.msg);
              }
            }
          })
        },
      })
    },
  }
})
