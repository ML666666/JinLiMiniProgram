const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AgentFrozenBalance:0,
    DeductionBalance:0,
    balance:0,
    Draw:[],
    list:[],
    selectType:null,
    getBalance:null,
    haveLoad:false,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true
  },
  onLoad: function (options) {
    this.getAllData(true)
  },
  onShow(){
    if (!this.data.haveLoad){
      return
    }
    this.getAllData();
  },
  onHide(){
    setTimeout(()=>{
        this.isRefreshing();
    },200)
  },
  refresh(){
    this.isRefreshing();
    this.getAllData();
  },
  getAllData(isChangeRender=false){
    let GetMemberDrawAccount = this.GetMemberDrawAccount();
    let GetBalance = this.GetBalance();
    let GetWithdrawType = this.GetWithdrawType();
    Promise.all([GetMemberDrawAccount, GetBalance, GetWithdrawType]).then(res => {
      this.setData({
        list: res[0].data.list,
        AgentFrozenBalance: res[1].data.AgentFrozenBalance,
        DeductionBalance: res[1].data.DeductionBalance,
        balance: res[1].data.balance,
        Draw: this.setDraw(res[2].data.Draw, res[0].data.list),
        selectType: res[2].data.Draw[0].type,
        haveLoad: true
      })
      this.isRefreshing();
      isChangeRender?this.setData({ isRenderingPage: !this.data.isRenderingPage}):null;
    })
  },
  isRefreshing(isChangeRender=true){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing
    })
  },
  setDraw(Draw, list){
    if(list.length==0){
      return Draw
    }else{
      for(let v in list){
        let DrawType = list[v].DrawType;
        for (let v in Draw){
          Draw[v].type == DrawType ? Draw[v].DrawAccount = list[v].DrawAccount:null;
        }
      }
      return Draw
    }
    
  },
  toGetBalance(){
    if (this.data.list.length){
      app.globalData.post('UserCenter/Withdraw',{
        DrawId: this.data.selectType,
        DrawAmount: this.data.getBalance
      }).then(res=>{
        app.globalData.toast(res.data.msg);
      })
    }else{
      wx.navigateTo({
        url: `/pages/me/page/RemainingSum/TheCoupleWithdrawal/TheCoupleWithdrawal?DrawType=${this.data.selectType}`,
      })
    }
  }, 
  input(e){
    let getBalance = e.detail.value;
    getBalance > this.data.balance ? 
    this.setData({ getBalance : this.data.balance }) :
    this.setData({ getBalance });
  },
  getAll(){
    this.setData({
      getBalance: this.data.balance
    })
  },
  selectType(e){
    this.setData({
      selectType: e.currentTarget.dataset.type
    })
  },  
  GetMemberDrawAccount(){
    return this.ReturnPromise('UserCenter/GetMemberDrawAccount')
  }, 
  GetBalance(){
    return this.ReturnPromise('UserCenter/GetBalance')
  },
  GetWithdrawType(){
    return this.ReturnPromise('UserCenter/GetWithdrawType')
  },
  ReturnPromise(url){
    return new Promise((resolve, reject) => {
      app.globalData.post(url, {}).then(res => {
        resolve(res);
      })
    })
  },
  toJl(){
    wx.navigateTo({
      url: '/pages/me/page/RemainingSum/WithdrawalRecord/WithdrawalRecord?name=提现记录&type=2',
    })
  }
})