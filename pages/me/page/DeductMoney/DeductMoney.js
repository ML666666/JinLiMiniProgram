const app = getApp();
Page({
  data:{
    obj:null,
    pageIndex: 1,
    pageSize:8,
    isOver:false,
    isLoading:false,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true
  },
  isRefreshing(){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing
    })
  },
  onLoad: function (options) {
    this.GetDeductionLog().then(res=>{
      let obj = res.data;
      obj.list = this.FixedList(obj.list);
      this.setData({ obj, isOver: obj.list.length >= this.data.pageSize ? false : true});
      this.isRefreshing();
      this.setData({ isRenderingPage: false });
    })
  },
  refresh(){
    this.isRefreshing();
    this.setData({isOver:false});
    this.GetDeductionLog(1).then(res=>{
      let obj = res.data;
      obj.list = this.FixedList(obj.list);
      this.isRefreshing();
      this.setData({obj, pageIndex:1});
    })
  },
  GetDeductionLog(pageIndex=this.data.pageIndex){
    return app.globalData.post("UserCenter/GetDeductionLog", { pageIndex: pageIndex,pageSize:this.data.pageSize})
  },
  FixedList(list){
    return list.map((item) => {
      item.DeductionBalance = item.DeductionBalance.toFixed(2);
      return item;
    })
  },
  onReachBottom(){
    if(this.data.isOver){
      return
    }
    this.setData({ isLoading:true})
    let pageIndex = this.data.pageIndex;
    this.GetDeductionLog(++pageIndex).then(res=>{
      let _obj = res.data;
      let obj = this.data.obj;
      _obj.list = this.FixedList(_obj.list);
      obj.list = [...obj.list,..._obj.list];
      this.setData({ 
          obj, 
          isLoading:false,
          pageIndex,
          isOver:_obj.list.length>=this.data.pageSize?false:true});
    })
  }
})