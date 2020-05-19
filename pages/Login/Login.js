// pages/Login/Login.js
const app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LogoUrl: `${baseUrl}upload/Picture/comment/201910/5426766c21fa458d8a06018d4a242217.png?v=1.0.41`,
    btnUrl: `${baseUrl}upload/Picture/comment/201910/bc60bc48e3d240519dfae548904dd307.png?v=1.0.41`,
    windowHeight:null,
    show:false,
    phone:null,
    code:null,
    timer:null,
    time:60,
    isAble:false,
    isAbleToGetUserInfo:false,
    res:true,//登录状态
    isLoading:false,
    isdefault:true,
  },
  onLoad(){
    //获取用户信息
    this.setData({ windowHeight: app.globalData.windowHeight - app.globalData.navHeight});
    wx.getLocation({
      success(res){
        wx.setStorageSync('Location', res); // latitude维度 longitude经度
      }
    }) 
    wx.login({ success: res => { this.setData({res});}})
  },
  // 关闭模态框
  onClose() {
    this.setData({ show: false });
  },
  toXY(){
    wx.navigateTo({
      url: `/pages/me/page/HtmlRender/HtmlRender?type=fuwuxieyi`,
    })
  },
  CENCEL(){
    wx.switchTab({
      url: '/pages/MainChannel/MainChannel',
    })
  },
  // 获取手机验证码
  getCode(){
    if (this.data.time != 60){
      return
    }
    if(!this.data.phone){
      app.globalData.toast('请输入手机号!')
      return 
    }
    let clientid = wx.getStorageSync('userInfo');
    var obj = {
      MobilePhone: this.data.phone,
      type: 100,
      clientid: clientid.unionID
    }
    let post = app.globalData.post('index/GetCode',obj).then(res=>{
      if (res.data.success == 200){
        let _this = this;
        this.setData({ isAble:true})
        this.data.timer = setInterval(() => {
          let t = this.data.time;
          this.setData({ time: t - 1 }, () => {
            this.data.time == 0 ? clearInterval(this.data.timer) : null;
            this.data.time == 0 ? this.setData({ time: 60 }) : null;
          })
        }, 1000);
      }else{
        app.globalData.toast(res.data.msg);
      }
    })
  },
  changeIsdefault(){
    this.setData({
      isdefault: !this.data.isdefault
    })
  },
  // 绑定手机号
  bindPhone(){
    if (!this.data.isAble){
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
    let post = app.globalData.post('WeiXin/AppLoginValidatePhone', obj).then(res=>{
      if(res.data.success == 200){
        let user = res.data.currentUser;
        wx.setStorage({key: 'userInfo',data: user})
        wx.setStorage({ key: 'token', data: res.data.token})
        wx.navigateBack({ changed: true });  
      }else{
        app.globalData.toast(res.data.msg);
      }
    })
  },

  // 改变输入框内的值
  input(e){
    let obj = {}
    obj[e.target.dataset.name] = e.detail.value;
    this.setData(obj);
  },
  //检查登录状态是否过期
  checkSession(){
    let _this = this;
    return new Promise((resolve,reject)=>{
      wx.checkSession({
        success(res) {
          resolve(_this.data.res)},
        fail(err) {
          wx.login({success: res => {
            resolve(res);
            _this.setData({res});
          }})
        }
      })

    })
  },
  // 获取用户信息/小程序登录
  getUserInfoFun: function (e) {
    if (!this.data.isdefault){
      wx.showModal({
        title: '提示',
        content: '请先阅读锦鲤团用户服务协议！',
        showCancel: false
      })
      return
    }
    this.setData({ isLoading: !this.data.isLoading});
    wx.showNavigationBarLoading();
    var _this = this;
    let userInfo = {}
    // 检查状态
    this.checkSession().then(res=>{
        wx.getUserInfo({
              success(user){
                  userInfo = Object.assign(user.userInfo,res,e.detail);
                  let Location = wx.getStorageSync('Location');
                  let obj = {
                    code: userInfo['code'],
                    encryptedData: userInfo['encryptedData'],
                    iv:userInfo['iv'],
                    Locat: JSON.stringify({ "LngLatStr": `${Location.longitude},${Location.latitude}` })
                  }
                  wx.setStorageSync('Locat', JSON.stringify({ "LngLatStr": `${Location.longitude},${Location.latitude}` }))
                  // 判断是否有上级ID
                  wx.getStorageSync('HigherlevelMemberId') ? 
                      obj["MemberId"] = wx.getStorageSync('HigherlevelMemberId') : 
                        obj["MemberId"] = null;
                  let post = app.globalData.post('WXXCX/OAuth', obj).then(respose=>{
                    wx.login({ success: res => { _this.setData({ res });}});//调用登录接口成功后，重新获取res
                    
                    if (respose.data.success==402){ //为绑定手机则显示模态框，让用户绑定手机
                      userInfo['unionID'] = respose.data.unionID;
                      wx.setStorageSync('userInfo',userInfo);//缓存用户数据                 
                      _this.setData({ show: true });//展示绑定手机弹窗
                      _this.setData({ isLoading: !_this.data.isLoading });//取消Loading状态
                    }else{
                      
                      wx.setStorageSync('token', respose.data.token); //缓存token数据    
                      wx.setStorageSync('userInfo', respose.data.currentUser);//缓存用户数据    
                      // 判断是否为天使会员
                      app.globalData.post('UserCenter/GetIsAngel', {}).then(res => {
                          res.data.success == 200 ? wx.setStorageSync('IsAngel', res.data.IsAngel) : null;
                      })
                      if (typeof wx.getStorageSync('userInfo') == 'object') { //表明登录成功
                        app.globalData.post('Index/GetWebSocketUrl',{}).then(res=>{ //获取弹窗Socke
                          let webSocketUrl = res.data.webSocketUrl;
                          wx.setStorageSync('webSocketUrl', webSocketUrl);
                          app.globalData.Socket.getInstence(webSocketUrl).connectSocket();
                          _this.setData({ isLoading: !_this.data.isLoading });//取消Loading状态
                          wx.navigateBack({ changed: true });
                        })
                      }else{
                        _this.setData({ isLoading: !_this.data.isLoading });//取消Loading状态
                        wx.showModal({
                          title: '提示',
                          content: '微信授权失败,请点击按钮重新授权！',
                          showCancel: false
                        })
                      }
                    }
                    wx.hideNavigationBarLoading()
                  }).catch((res)=>{
                    wx.login({ success: res => { _this.setData({ res }); } });//调用登录接口成功后，重新获取res
                    _this.setData({ isLoading: !_this.data.isLoading });
                  })
              }, fail(err) { 
                _this.setData({ isLoading: false });
                wx.hideNavigationBarLoading()
                }
              }
            )
    })
  },
})