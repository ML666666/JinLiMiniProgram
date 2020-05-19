
export class Socket {
  constructor(url){
    this.url = url;
    this.limit = 0;
    this.timer = null;
    this.lockReconnect = false;
    this.app = getApp()
  }
  static getInstence(url) {
    if (this.instence) {
      return this.instence
    } else {
      this.instence = new Socket(url)
      return this.instence
    }
  }
  connectSocket(){
    let _this = this;
    let url = _this.url;
    console.log("connecting")
    console.log(_this.url);
    wx.connectSocket({
      url: url,
      success(res){
        _this.WatchSocket();
        // _this.test();
      }
    })
  }

  WatchSocket(){
    wx.onNetworkStatusChange(res=>{
      if (!res.isConnected){
        this.app.globalData.toast('网络似乎出了点问题');
      }else{
        this.Reconnect();
        this.app.globalData.toast('网络已恢复');
      }
    })
    wx.onSocketOpen((res)=>{
      console.log('SocketOpen!!');
    })
    wx.onSocketMessage((res)=>{
      if (JSON.parse(res.data).Code > 1000){
        this.app.store.setState({
          SocketObj: JSON.parse(res.data)
        });
      }

    })
    wx.onSocketError((res)=>{
      console.log(res)
      // console.log('SocketError!!');
      this.Reconnect()
    })
    wx.onSocketClose(()=>{
      console.log('SocketClose!!');
      this.Reconnect()
    })
  }

  Reconnect() {
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    clearTimeout(this.timer)
    if (this.limit < 2) {
      // this.app.globalData.toast('重新连接中....');
      this.timer = setTimeout(() => {
        this.connectSocket();
        this.lockReconnect = false;
      }, 5000);
      this.limit++;
    }else{
      // 重连两次后并失败表明Socket失效，并重新获取新的Socket
      this.app.globalData.post('Index/GetWebSocketUrl', {}).then(res => { //获取弹窗Socke
        let webSocketUrl = res.data.webSocketUrl;
        wx.setStorageSync('webSocketUrl', webSocketUrl);
        this.app.globalData.Socket.getInstence(webSocketUrl).connectSocket();
        this.limit == 0;
      })
    }
  }

  test(){
       let i = 2
       setInterval(()=>{
          this.app.store.setState({
            SocketObj: {
              Code: ++i
            }
          });
       },1500)
  }

}