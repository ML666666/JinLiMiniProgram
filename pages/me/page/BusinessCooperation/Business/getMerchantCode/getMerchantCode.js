const app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl;
const isZS = app.globalData.gob.config.baseUrl.indexOf('https')>0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgUrl: baseUrl +`upload/Picture/comment/201910/5d87cf5cfa6d438bb3f16407ed770190.png?v=1.0.41`,
    topUrl: baseUrl+'upload/Picture/comment/201910/9bfa33f698d7414ea7e12805ba46808c.png?v=1.0.41',
    refreshed:false,
    refreshing:true,
    isRenderingPage:true
  },
  refresh(){
    this.isRefreshing();
    this.isRefreshing();
  },
  onReady(){
    
    app.globalData.post('Supplier/GetOfflineShopPayQR',{}).then(res=>{
      let fileName = res.data.data.fileName;
      let URLINDEX = res.data.data.fileName.indexOf('Upload');
      let URL = res.data.data.fileName.substr(URLINDEX);
      let QRPATH = baseUrl + URL;
      Promise.all([this.getNetWorkImageInfo(isZS?QRPATH:fileName), this.getNetWorkImageInfo(this.data.bgUrl)]).then(path=>{
        let _this = this;
        let ctx = wx.createCanvasContext('canvasImage');
        ctx.drawImage(path[1], 0, 0, this.getPx(750), this.getPx(1010));
        ctx.drawImage(path[0], this.getPx(201), this.getPx(305), this.getPx(350), this.getPx(350));
        ctx.save();
        ctx.draw(false, () => {
          wx.canvasToTempFilePath({
            fileType: 'png',
            canvasId: 'canvasImage',
            success: (res) => {
              _this.setData({ path: res.tempFilePath });
              _this.isRefreshing();
              _this.setData({ isRenderingPage: !_this.data.isRenderingPage })
            }, fail(res) {
              console.log(res);
            }
          }, this)
        });
      })



    })
  },
  isRefreshing(){
    console.log(1);
    this.setData({ refreshed: !this.data.refreshed, refreshing: !this.data.refreshing})
  },
  saveImage(){
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
  getPx(rpx){
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