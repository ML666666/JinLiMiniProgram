const MD5 = require('./gobMehods/md5.js');
const hexMD5 = MD5.hexMD5;
const returnMd5 = MD5.returnMd5;
const objKeySort = MD5.objKeySort;
const app = getApp();
let gob = {
  //URL配置
  returnMd5: hexMD5,

  config:{
    // baseUrl:'http://www.huizhisuo.com/',
    // baseUrl: 'http://h5.huizhisuo.com/', 
    // baseUrl: 'http://192.168.0.200:821/',    
    // baseUrl: 'http://api.huizhisuo.com/',
    // baseUrl:'http://192.168.0.218:825/',  
    // baseUrl:'http://192.168.0.200:818/',
    baseUrl:'https://www.huizhisuo.com/',
    // _baseUrl: 'http://h5.huizhisuo.com/',
    _baseUrl: 'https://www.huizhisuo.com/',
    // wx:'ws://192.168.0.200:1025'
  },
  //路由拦截
  isCheck(){
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    var options = currentPage.options //如果要获取url中所带的参数可以查看options
    return url.indexOf('/me') >= 0;
  },
  //Promise封装POST方法  

  post(url, data, method ="POST"){
    let timeString = new Date().getTime().toString();
    let byMd5 = {};
    byMd5['timeStamp'] = timeString.substr(0, timeString.length - 3);
    byMd5['version'] = 1;
    byMd5['client'] = 3;
    wx.getStorageSync('token') ? byMd5['token'] = wx.getStorageSync('token') : '';
    data = Object.assign(data,byMd5);
    data['sign'] = returnMd5(byMd5);
    data['Locat'] = wx.getStorageSync('Locat');
    // wx.getStorageSync('token') ? data['token'] = wx.getStorageSync('token') : '';
    return new Promise((resolve,reject)=>{
      wx.request({
        url: `${this.config.baseUrl}${url}`,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method,
        data: data,
        success:((res)=>{
          getApp().store.setState({isGetDataFail: false});
          if (res.data.success != 200 && this.isCheck()){ //非登录状态 
            resolve(res);
            if (res.data.success == 300){
              getApp().globalData.toast(res.data.msg);
            }else{
              wx.navigateTo({
                url: '/pages/Login/Login',
              })
            }
          }
          resolve(res);
        }),
        fail:((res)=>{
          reject(res);
          getApp().store.setState({
            isGetDataFail: true
          });
          getApp().globalData.toast("请求超时!请重新操作!");
          throw res;
        }) 
      }) 
    })
  },
  // 拦截分享链接
  interceptShare(path, title, imageUrl, desc,isDefaultImage=false){
    const pages = getCurrentPages();
    const perpage = pages[pages.length - 1];
    const ShareConfig = wx.getStorageSync('ShareConfig');
    path = path ? path : perpage.route;
    title = title ? title : '锦鲤团购商城';
    imageUrl = imageUrl ? imageUrl : 'https://www.huizhisuo.com/upload/xcx/fx1.jpg';
    imageUrl = isDefaultImage?null:imageUrl;
    desc = desc ? desc : ShareConfig.shareDesc;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo){
      path = path.indexOf('?') > 0 ? path + `&HigherlevelMemberId=${userInfo.MemberId}` : path +`?HigherlevelMemberId=${userInfo.MemberId}`
      return { path, title, imageUrl, desc};
    }else{
      return { path, title, imageUrl, desc};
    }
  }
}

export default gob;