import { Socket } from './Socket.js';
export class DataInit{
  constructor(SystemObj, post){
    this.SystemObj = SystemObj; //App实例
    this.post = post; //post方法
  }
  // 获取 数据初始化单利对象
  static GetInstence(SystemObj, post){
    if (this.instence){
      return this.instence
    }else{
      this.instence = new DataInit(SystemObj, post)
      return this.instence
    }
  }
  // 获取系统信息
  GetSystemInfo(){
    let t = this.SystemObj;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.windowHeight = res.windowHeight;
        t.globalData.rpxTopx = res.windowWidth / 750
        t.globalData.systemInfo = res;
        //导航高度
        t.globalData.navHeight = res.statusBarHeight + 47;//46px是官方规定的导航栏高度
        t.globalData.statusBar = 47;
      }
    });
  }
  // 获取系统配置
  GetConfig(){
    this.post('index/GetConfig', {}).then(res => { wx.setStorageSync('configUrl', res.data.data); })//获取配置信息
  }

  GetWebSocketUrl(){
    return this.post('Index/GetWebSocketUrl', {}).then(res => { console.log(res) });
  }
  
  SetHigherlevelMemberId(opt){
    opt.query.HigherlevelMemberId ? //缓存分享链接上的上级MemberId
       wx.setStorageSync('HigherlevelMemberId', opt.query.HigherlevelMemberId) :
       wx.setStorageSync('HigherlevelMemberId', null);
  }

  InitSocket(){
        setTimeout(() => {
          // 判断是否有长链接地址
          wx.getStorageSync('webSocketUrl') ? Socket.getInstence(wx.getStorageSync('webSocketUrl')).connectSocket() : null
        }, 1000)
  }

  ShareConfig(){
    let baseUrl = this.SystemObj.globalData.gob.config.baseUrl;
    this.post("WeiXin/GetShareConfig", { url: baseUrl}).then(res=>{
      wx.setStorageSync('ShareConfig', res.data.data)
    })
  }
}