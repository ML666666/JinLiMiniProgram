const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  attached(){
    this.setData({ token:wx.getStorageSync('token')})
  },
  /**
   * 组件的初始数据
   */
  data: {
    list:[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(e){
      let item = e.currentTarget.dataset.index;
      let obj = [];
      obj[item] = '';
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
                let list = _this.data.list;
                list[list.length] = JSON.parse(res.data).paths[0]
                _this.setData({ list });
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
