const app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl;
const isZS = app.globalData.gob.config.baseUrl.indexOf('https') > 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowImage:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ shopid: options.shopid },()=>{
      let obj = {
        shopId: this.data.shopid,
      }
      let post = app.globalData.post('index/getShopInfo', obj).then(res => {
        this.setData({ topData: res.data.shop });
      })
    })
  },
  showImage(){
    this.setData({ isShowImage: !this.data.isShowImage })
  },

  
  saveImage() {
    this.PromiseSaveImageToPhotosAlbum(this.data.path).then(res => {
      app.globalData.toast("保存图片成功！")
    })
  },
  PromiseSaveImageToPhotosAlbum(path) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: function (data) {
          resolve(true);
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getPx(rpx) {
    return rpx / 750 * wx.getSystemInfoSync().windowWidth;
  },
  getNetWorkImageInfo(remote_url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: remote_url,
        success: res => {
          resolve(res.path)
        }
      });
    })
  },
})