const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  // UserCenter/SaveMemberDrawAccount
  data: {
    DrawAccount: null,
    DrawRealName: null,
    DrawType: 0,
  },
  onLoad(option){
    console.log(option)
    this.setData({ DrawType: option.DrawType})
  },
  input(e){
    let name = e.currentTarget.dataset.name;
    let value = e.detail.value;
    let obj = {};
    obj[name] = value;
    this.setData(obj);
  },
  back(){
    wx.navigateBack({})
  },
  alert(msg = "实名信息绑定后无法修改"){
    app.globalData.toast(msg)
  },
  onShow(){
    this.alert();
  },
  toBuy(){
    if (!this.data.DrawAccount){
      this.alert("请输入你的名字");
      return
    }
    if (!this.data.DrawRealName){
      this.alert("请输入支付宝账号");
      return
    }
    app.globalData.post('UserCenter/SaveMemberDrawAccount',{
      DrawAccount: this.data.DrawAccount,
      DrawRealName: this.data.DrawRealName,
      DrawType: this.data.DrawType
    }).then(res=>{
      if(res.data.success==200){
        this.alert("实名信息绑定成功!");
        setTimeout(()=>{
          wx.navigateBack({})
        },200);
      }else{
        this.alert(res.data.msg);
      }
    })
  }
})