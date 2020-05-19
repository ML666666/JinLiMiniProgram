// pages/search/SearchResult.js
const app = getApp();
Page({

  data: {
    categoryid: 0, 
    keyword: "", //搜索关键字
    pageindex: 1, //页码
    pagesize: 10, //每页数量
    isSearch:false, //是否搜索
    SearchKeyWord:[], //历史搜索关键字
    resultList:[],// 商品列表数组
    isOver:false,
    refreshed:true,
    refreshing:false,
    isRenderingPage:false,
    SearchKeyWordList:[],
    categoryidLst:null
  },

  onLoad(option){
    // this.setData({ categoryidLst: option.categoryidLst },()=>{
    //   let obj = {
    //     categoryid: this.data.categoryidLst,
    //     pageindex: 1,
    //     pagesize: this.data.pagesize,
    //     categoryidLst: this.data.categoryidLst
    //   }
    //   let post = app.globalData.post('index/getsearchproduct', obj).then(res => {
    //     this.setData({ resultList: res.data.rows, isSearch:true });
    //   })
    // })
  },
  onShow(){
    this.isHaveStorageOfKeyWord().then((res)=>{
      res ? this.setData({ SearchKeyWord: res }) : this.setData({ SearchKeyWord:'' });
    })
  },
  
  input(e){
    this.setData({ keyword : e.detail.value},()=>{ 
      this.data.keyword.length ? 
            this.setData({ isSearch: true, resultList: [] }, () => {this.getSearchSuggest()}) : 
                this.setData({ isSearch: false })
    })
  },
  cancel(){
    wx.navigateBack({})
  },
  // 获取联想关键字
  getSearchSuggest(){
    app.globalData.post('index/getSearchSuggest', { keyword: this.data.keyword }).then(res=>{
      let keywords = JSON.parse(res.data.keywords);
      keywords[0]['version'] ? this.setData({ SearchKeyWordList: [] }) : this.setData({ SearchKeyWordList: keywords });
    })
  },
  // 点击搜索时触发事件
  search(e){
    e.type == 'tap' ? this.toSearch(e.target.dataset.keyword)  : this.toSearch();
    e.type == 'tap' ? this.setData({
      keyword: e.target.dataset.keyword,
      isSearch: true
    }):''
  },  
  tapSearchKetWord(e){
    this.setData({ keyword: e.target.dataset.keyword }, () => { 
      this.toSearch(this.data.keyword)
    })
  },
  toGoodDetail(e){
    wx.navigateTo({
      url: `/pages/GeneralItemDescription/GeneralItemDescription?id=${e.currentTarget.dataset.id}`,
    })
  },

  toSearch(keyword,callBack){
    // 判断是为确认搜索按钮触发或搜索记录触发
    let _keyword = keyword.type ? this.data.keyword:keyword;
    let obj = {
      categoryid: 0,
      keyword: _keyword,
      pageindex: 1,
      pagesize: this.data.pagesize,
      categoryidLst: this.data.categoryidLst
    }
    let post = app.globalData.post('index/getsearchproduct',obj).then(res=>{
      this.setData({ resultList: res.data.rows, pageindex: 1, pagesize: 10, isOver:false});
      this.setData({ SearchKeyWordList: [] })
      callBack()
    })
    
    this.isHaveStorageOfKeyWord().then((res) => {
      this.setStorageOfKeyWord(this.data.keyword, res);
    })
  },

  // 是否第一次搜索,否返回false，真返回结果
  isHaveStorageOfKeyWord(){
    return new Promise((resolve,reject)=>{
      wx.getStorage({
        key: 'SearchKeyWord',
        success(res) {
          resolve(res.data);
        }, fail() {
          resolve(false);
        }
      })
    })
  },

  // 存取收拾关键字
  setStorageOfKeyWord(keyWord,isFrist){
    let _this = this;
    !isFrist ? 
              wx.setStorage({ key: 'SearchKeyWord', data: [this.data.keyword] }) : 
               wx.setStorage({
                  key: 'SearchKeyWord', data: [...new Set([...isFrist, keyWord])], success(){
                  _this.setData({ SearchKeyWord: [...new Set([...isFrist, keyWord])]})
               }})
  },
  // 删除缓存
  Delete(){
    let _this = this;
    wx.setStorage({
      key: 'SearchKeyWord',
      data: [],
      success(){
        _this.setData({ SearchKeyWord: [] })
      }
    });
  },
  // 上拉加载更多
  onReachBottom: function () {
    if (this.data.isOver){
      return
    }
    let pageindex = this.data.pageindex+1;
    let obj = {
      categoryid: 0,
      keyword: this.data.keyword,
      pageindex: pageindex,
      pagesize: this.data.pagesize,
    }
    let post = app.globalData.post('index/getsearchproduct', obj).then(res => {
      this.setData({ resultList: [...this.data.resultList, ...res.data.rows], pageindex: pageindex},()=>{
          res.data.rows.length < this.data.pagesize?this.setData({isOver:true}):''
      });
    })
  },
  isRefreshing(){
    this.setData({
      refreshed: !this.data.refreshed,
      refreshing: !this.data.refreshing,
    })
  },
  refresh(){
    this.isRefreshing();
    
    if (this.data.isSearch){
      this.toSearch({},()=>{
        this.isRefreshing();
      });
    }else{
      console.log('1')
      this.isRefreshing();
    }
  }
})