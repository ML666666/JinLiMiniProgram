// pages/me/page/orderList/Comment/Comment.js
const gob = require('../../../../../gob/gob.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows:null,
    Comment:null,
    imgList:[],
    OrderId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({ OrderId: options.OrderId});
    app.globalData.post('account/getmyorderDetail', { orderId:options.OrderId}).then(res=>{
      res.data.success == 200 ? this.setData({rows:res.data.rows}):null;
    })
  },
  onlnput(e){
    this.setData({ Comment:e.detail.value });
  },
  addImg(){
    let _this = this;
    wx.chooseImage({
      count: 1, 
      success: function(res) {
        var tempFilePaths = res.tempFilePaths[0];
        let baseUrl = gob.default.config.baseUrl;
        wx.uploadFile({
          url: `${baseUrl}UpLoad/Img`,
          filePath: tempFilePaths,
          name: 'file',
          formData: {
            dir:0,
            token: wx.getStorageSync('token')
          }, 
          header: {
            "Content-Type": "multipart/form-data"
          },
          success(res){
            if (JSON.parse(res.data).success==200){
              let imgList = _this.data.imgList;
              imgList[imgList.length] = JSON.parse(res.data).paths[0];
              _this.setData({ imgList })
            }else{
              console.log(1)
              app.globalData.toast(res.data.msg);
            }
          } 
        })
      },
    })
  },
  makeSure(){
    if (!this.data.Comment){
      app.globalData.toast("亲,评论不能为空哦~");
      return
    }
    let obj = {
      OrderId: this.data.OrderId,
      Type:0,
      list: JSON.stringify([{
         "Imgs": this.data.imgList, 
         "Comment": this.data.Comment ? this.data.Comment:null, 
         "ProductId": this.data.rows.LstProduct[0].ProductId
      }])
    }
    app.globalData.post('Order/ProductComment',obj).then(res=>{
      if(res.data.success==200){
        app.globalData.toast("评论成功!");
        wx.navigateTo({
          url: '/pages/me/page/orderList/orderList?index=4',
        })
      }else{
        app.globalData.toast(res.data.msg);
      }
    })

    // Order / ProductComment
    // console.log(obj);
    // let obj = {
    //   OrderId: 403290,
    //   Type: 0,
    //   list: "[{"Imgs":["http://192.168.0.200:817/upload/Picture/comment/201907/b6ecb6484c9447ad8e53c4e63df79770.png?v="],"Comment":"ceshi","ProductId":99988}]"
    // }
  },
  onShow(){

  }
})