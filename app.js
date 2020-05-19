const gob = require('./gob/gob.js').default;
const post = gob.post.bind(gob);//拦截分享链接方法
const interceptShare = gob.interceptShare;//全局POST方法
import { DataInit } from './utils/DataInit.js'; //初始化单利对象
import { Socket } from './utils/Socket.js';
import store from './utils/store.js';
App({
  onLaunch(opt){
    this.store.setState({ isGetDataFail: false });//该变量存储的是网络请求状态，成功为false ，失败为true
    let dataInit = DataInit.GetInstence(this, post)
    dataInit.GetSystemInfo();// 获取系统信息
    dataInit.GetConfig();//获取全局配置
    dataInit.SetHigherlevelMemberId(opt);//获取上级的MemberId 当该应用为其他用户分享给你时,Opt对象会用该用户的MemberId
    dataInit.InitSocket();//链接Socket
    dataInit.ShareConfig();//分享链接
  },
  store: store,//状态缓存器 如vuex
  // 拦截全局请求错误
  onError(res){
  },
  globalData:{
    MainPageUrl:'/pages/MainChannel/MainChannel',
    Socket, //Socket对象
    windowHeight:null,
    interceptShare: interceptShare,//拦截分享链接方法
    goodId: 84983,//商品测试ID 
    gob: gob,//全局方法
    post: post,//全局POST方法
    userInfo: null,
    //全局Tips框
    toast(text){
      wx.showToast({ title: text, icon: 'none'})
    },
    navHeight: 0,//导航栏高度
    statusBar: 0,//状态栏高度
    globaltitlelFontSize: 32,//默认头部标题字体大小
    IsAngel(){
      return new Promise((resolve,reject)=>{
        post('UserCenter/GetIsAngel', {}).then(res => {
          res.data.success == 200 ? wx.setStorageSync('IsAngel', res.data.IsAngel) : null;
          resolve(res)
        })
      })
    }
  }
})
