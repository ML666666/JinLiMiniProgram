// pages/me/page/orderList/orderList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    pagesize:10,
    isOver:true,
    rows:[],
    flexTop:0,
    refreshing:true,
    refreshed:false,
    payTypelist:[],
    isLoading:false,
    isRenderingPage:true,
    allRows:{},//缓存所有数据
    currentObj:{},//当前数据对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({index:options.index},()=>{
      this.getList().then(res=>{
        let one = this.setAllRows(options.index,res);
        let two = this.GetPayType();//获取支付类型
        Promise.all([one,two]).then(res=>{
          this.setData({ index:options.index});
          this.isReFreshing();
          this.setData({haveLoad:true});
          this.setData({ isRenderingPage: !this.data.isRenderingPage});
          this.setData({ currentObj: res[0] });
        })
      });
    });

    this.setData({ flexTop: app.globalData.navHeight})
  },
  onShow(){
    if(this.data.haveLoad){
      this.getList().then(res => {
        this.setAllRows(this.data.index, res, true).then((res) => {//缓存数据
          this.setData({ currentObj: res });
        });
      });
    }
  },
  // 获取数据列表
  getList(pageindex=1){
    return new Promise((resolve,reject)=>{
      let index = this.data.index == 5 ? 7 : this.data.index - 1;
      // console.log(index)
      let obj = {
        orderstatus: index,
        pageindex: pageindex,
        pagesize: this.data.pagesize,
      }
      app.globalData.post('account/getmyintegralorder', obj).then(res => {
        this.setData({ rows: res.data.rows })
        resolve(res.data.rows);
      })
    })
  },
  // 上拉加载更多
  onReachBottom(){
    
    let allRows = this.data.allRows;
    let index = this.data.index;
    let currentObj = this.data.allRows[index];
    let pageindex = currentObj.pageindex;
    if (currentObj.isOver || this.data.isLoading){
      return
    }
    this.setData({ isLoading: true });
    this.getList(++pageindex).then(res => {
      this.setAllRows(index, res).then(res=>{
        this.setData({
          currentObj:res
        });
        this.setData({ isLoading: false });
      })
    });
  },
  //下拉刷新
  refresh(){
    this.isReFreshing();
    let index = this.data.index;
    this.getList().then(res => {
      this.setAllRows(index, res,true).then((res) => {//缓存数据
        this.setData({ currentObj: res });
        this.isReFreshing();
      });
    });
  },
  //
  reSetData(){
    this.refresh();
  },

  isReFreshing(){
    this.setData({
      refreshing: !this.data.refreshing,
      refreshed: !this.data.refreshed
    })
  },
  //改变Tab时触发的回调函数
  changeTab(e){
    let index = e.detail.index; //当前ActiveIndex
    console.log(index);
    let currentObj = this.data.allRows[index];
    this.setData({ index: index});
    if (!this.findAllrows(index)){
      this.setData({ currentObj});
      return
    }else{
      this.isReFreshing();
      this.getList().then(res => {
        this.isReFreshing();
        this.setAllRows(index, res).then((res) => {//缓存数据
          this.setData({ currentObj:res });
        });
      });
    }
  },
  //查找数据
  findAllrows(index) {
    return typeof (this.data.allRows[index]) == 'undefined';
  },
  //缓存数据
  setAllRows(index,list,reLoad=false){
    return new Promise((resolve,reject)=>{
      let allRows = this.data.allRows;
      let isBeSave = typeof (allRows[index]) == 'undefined';
      allRows[index] = {
        Rows: isBeSave || reLoad ? [...list] : [...allRows[index].Rows, ...list],
        pageindex: isBeSave || reLoad ? 1 : allRows[index].pageindex + 1,
        isOver: list.length < this.data.pagesize ? true : false
      }
      this.setData({ allRows },()=>{
        resolve(allRows[index])
      })
    })
  },
  //前往订单详情
  toGeneralOrderDetails(e){
    let orderid = e.currentTarget.dataset.orderid;
    let ordertype = e.currentTarget.dataset.ordertype;
    wx.navigateTo({
      url: `/pages/me/page/orderList/GeneralOrderDetails/GeneralOrderDetails?orderid=${orderid}&ordertype=${ordertype}`,
    })
  },

  //获取字符类型 用待付款时 重新支付
  GetPayType() {
    return new Promise((resolve,reject)=>{
      app.globalData.post('Paying/GetPayType', {}).then(res => {
        resolve(res)
        res.data.success == 200 ? this.setData({ payTypelist: res.data.list }) : app.globalData.toast(res.data.msg);
      })
    })
  }
 
})