const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortDirection: false,
    pageindex: 1,
    pagesize: 10,
    categoryidLst: null,
    categoryid: null,
    sort:0,
    isOver:false,
    rows:[],
    activeTop:true,
    refreshed:false,
    refreshing:true,
    isRenderingPage:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  isRefreshed(){
    this.setData({ refreshed: !this.data.refreshed, refreshing: !this.data.refreshing });
  },
  refresh(){
    this.isRefreshed()
    this.setData({ pageindex:1 },()=>{
      this.GetSpecialAreaProduct().then(rows => {
        this.setData({ rows });
        this.isRefreshed();
      })
    })
  },
  onLoad: function (options) {
    this.setData({ navHeight: app.globalData.navHeight });
    this.setData({ name: options.name});
    this.setData({ categoryidLst: options.categoryidLst },()=>{
      this.GetSpecialAreaProduct().then(rows=>{
        this.setData({ rows })
        this.isRefreshed();
        this.setData({ isRenderingPage: !this.data.isRenderingPage });
      })
    });
  },
  toDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/GeneralItemDescription/GeneralItemDescription?id='+id,
    })
  },
  tap(e) {
    console.log(e)
    let sort = e.currentTarget.dataset.sort;
    this.data.sort == sort && (sort == 2) ?
      this.setData({ sortDirection: !this.data.sortDirection }) :
      this.setData({ sortDirection: false })
    this.setData({ sort }, () => {
      this.GetSpecialAreaProduct().then(rows => {
        this.setData({ rows })
      })
    })
  },
  getStatus(e) {
    this.setData(e.detail, () => {
      e.detail['pageindex'] = 1;
      this.GetSpecialAreaProduct().then(rows => {
        this.setData({ rows })
      })
    })
  },
  GetSpecialAreaProduct(){
    return new Promise((resolve,reject)=>{
      let obj = {
        pageindex: this.data.pageindex,
        pagesize: this.data.pagesize,
        categoryidLst: this.data.categoryidLst,
        categoryid: this.data.categoryidLst,
        keyword:'',
        sort: this.data.sort,
        sortDirection: this.data.sortDirection ? 1 : 0,
        brandId: '',
        gwb:this.data.gwb
      }
      app.globalData.post('index/getsearchproduct', obj).then(res=>{
        resolve(res.data.rows);
      })
    })
  },
  onReachBottom: function () {
    if (this.data.isOver) {
      return
    }
    let rows = this.data.rows;
    let pageindex = this.data.pageindex;
    this.setData({ pageindex: pageindex + 1 }, () => {
      this.GetSpecialAreaProduct().then(_rows => {
        rows = [...rows, ..._rows];
        this.setData({ isOver: _rows.length < this.data.pagesize });
        this.setData({ rows });
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})