const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TwoPersonObj:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ navHeight: app.globalData.navHeight});
    this.setData({ statusBar: app.globalData.statusBar});
    this.setData({ TwoPersonChipNo: options.TwoPersonChipNo},()=>{
      app.globalData.post("TwoPersonChip/ShareChip", { TwoPersonChipNo: this.data.TwoPersonChipNo}).then(res=>{
        let endTime = res.data.TowGroup[0].EndTotalSeconds > 0 ? 
                            res.data.TowGroup[0].EndTotalSeconds : 
                                  res.data.TowGroup[0].EndTotalSeconds*-1
        this.setData({ TwoPersonObj: res.data, EndTime: endTime},()=>{
          console.log(res.data);
          let timeObj = this.renderList(this.data.EndTime);
          this.setData({ EndTime: timeObj.EndTime });
          this.setData({ EndTimeStr: timeObj.EndTimeStr });
          setInterval(()=>{
            let timeObj = this.renderList(this.data.EndTime);
            this.setData({ EndTime: timeObj.EndTime});
            this.setData({ EndTimeStr: timeObj.EndTimeStr });
          },1000)
        });
      })
    })
  },

  toDetail(){
    wx.navigateTo({
      url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${this.data.TwoPersonObj.Product.Id}
      &goodtype=${2}&TwoPersonChipNo=${this.data.TwoPersonChipNo}`,
    })
  },

  backHome(){
    wx.switchTab({
      url: '/pages/main/main',
    })
  },

  renderList(EndTime) {

    let timeObj = {}
    let hours = parseInt(EndTime / 60 / 60 % 24, 10);//计算剩余的小时
    let minutes = parseInt(EndTime / 60 % 60, 10);//计算剩余的分钟
    let seconds = parseInt(EndTime % 60, 10);//计算剩余的秒数
    let EndTimeStr = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds<10? '0' + seconds : seconds}`;
    timeObj['EndTimeStr'] = EndTimeStr;
    timeObj['EndTime'] = EndTime - 1;
    
    return timeObj
  }

})