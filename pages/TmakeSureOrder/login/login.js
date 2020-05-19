const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    phone: null,
    code: null,
    timer: null,
    time: 60,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose(e){
      this.triggerEvent('reSetBuy', { isReSet: false })
    },
    input(e) {
      let obj = {}
      obj[e.target.dataset.name] = e.detail.value;
      this.setData(obj);
    },
    getCode() {
      if (this.data.time != 60) {
        return
      }
      if (!this.data.phone) {
        app.globalData.toast('请输入手机号!')
        return
      }
      let clientid = wx.getStorageSync('userInfo');
      var obj = {
        MobilePhone: this.data.phone,
        type: 100,
        clientid: clientid.unionID
      }
      let post = app.globalData.post('index/GetCode', obj).then(res => {
        if (res.data.success == 200) {
          let _this = this;
          this.setData({ isAble: true })
          this.data.timer = setInterval(() => {
            let t = this.data.time;
            this.setData({ time: t - 1 }, () => {
              this.data.time == 0 ? clearInterval(this.data.timer) : null;
              this.data.time == 0 ? this.setData({ time: 60 }) : null;
            })
          }, 1000);
        } else {
          app.globalData.toast(res.data.msg);
        }
      })
    },
    bindPhone() {

      if (!this.data.isAble) {
        app.globalData.toast('请先获取验证码!')
        return
      }
      if (!this.data.phone) {
        app.globalData.toast('请输入手机号!')
        return
      }
      if (!this.data.code) {
        app.globalData.toast('请输入验证码!')
        return
      }
      let unionID = wx.getStorageSync('userInfo').unionID
      var obj = {
        code: this.data.code,
        phone: this.data.phone,
        type: 100,
        unionID: unionID
      }
      let post = app.globalData.post('account/UpdatePhone', obj).then(res => {
        if (res.data.success == 200) {
          this.triggerEvent('reSetBuy', { isReSet: true })
        } else {
          app.globalData.toast(res.data.msg);
        }
      })
    },
  }
})
