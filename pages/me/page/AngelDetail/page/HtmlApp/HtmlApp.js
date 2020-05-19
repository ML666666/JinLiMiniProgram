const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Obj:null
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    console.log(options)
    app.globalData.post('index/GetDescHtml', { DescName: options.Good_id }).then(res => {
      res.data.data.html = res.data.data.html.replace(/<img src="/,
       `<img style="width:100%;heigth:auto;" src="${app.globalData.gob.config.baseUrl}`);
      res.data.success == 200 ? this.setData({ Obj:res.data.data }) : app.globalData.toast(res.data.msg);
    })
  },
})