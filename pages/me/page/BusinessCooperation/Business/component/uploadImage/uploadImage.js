const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tips:{
      type:String,
      value:'营业执照电子版/照片'
    },
    isShowTips:{
      type:Boolean,
      value:true
    },
    ImgaeName:{
      type:String,
    },
    ImageUrl:{
      type:String,
      observer(val){
        let url =  val.startsWith('[')?JSON.parse(val)[0]:val
        this.setData({ img: url })
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
      let obj = [];
      let getImage = {};
      let name = this.properties.ImgaeName;
      let item = e.currentTarget.dataset.index;
      obj[item] = '';
      getImage[name] = ''
      this.setData(obj);
      this.triggerEvent('getImage', getImage)
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
              client: 3,
              token: _this.data.token
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success(res) {
              console.log(res)
              if (JSON.parse(res.data).success == 200) {
                // console.log(JSON.parse(res.data).paths[0]);
                let obj = [];
                let getImage = {};
                let name = _this.properties.ImgaeName;
                obj[item] = JSON.parse(res.data).paths[0];
                getImage[name] = JSON.parse(res.data).paths[0];
                _this.triggerEvent('getImage', getImage)
                _this.setData(obj)
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
