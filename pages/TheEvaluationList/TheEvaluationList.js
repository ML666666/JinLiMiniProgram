// pages/TheEvaluationList/TheEvaluationList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data:{
    PageIndex: 1,
    PageSize: 20,
    Type: 0,
    productid: "83059", //默认“83059”测试用
    List:[],
    isOver:false,
    isShowSwiper:false,
    activeMaks:false,
  },
  // onShareAppMessage: function () {
  //   let shareObj = app.globalData.interceptShare();
  //   shareObj['imageUrl'] = null;
  //   return shareObj
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.productid ? this.setData({ productid: options.productid ? options.productid : 87535},()=>{
      this.getList(this.data.PageIndex);
    }) : this.getList(this.data.PageIndex);
  },
  getList(PageIndex){
    return new Promise((resolve,reject)=>{
      let List = this.data.List;
      let obj = {
        PageIndex,
        pageSize: this.data.PageSize,
        Type: this.data.Type,
        productid: this.data.productid
      }
      app.globalData.post('index/GetCommentList', obj).then(res => {
        resolve(res.data.data);
        this.setData({ List: [...List, ...res.data.data] })
      })
    })
  },
  onReachBottom: function () {
    if(this.data.isOver){
      return
    }
    let PageIndex = this.data.PageIndex;
    this.getList(++PageIndex).then(res=>{
      res.length<this.data.PageSize?this.setData({isOver:true}):''
      this.setData({ PageIndex})
    })
  },
  showSwiper(e){
    let currentTarget = e.currentTarget.dataset;
    this.setData({ ImgIndex: currentTarget.imgindex});
    this.setData({ TIndex: currentTarget.index });
    this.setData({ isShowSwiper:true})
  },
  swiperChange(e){
    this.setData({ ImgIndex: e.detail.current });
  },
  hide(){
    this.setData({ activeMaks:false })
  },
  setUrl(e){
    let index = e.currentTarget.dataset.index;
    let url = e.currentTarget.dataset.url;
    let TImgList = this.data.TImgList;
    TImgList[index] = TImgList[index]?null:url;
    this.setData({ TImgList });
  },
  toShare(e){
    let index = e.currentTarget.dataset.index;
    let List = this.data.List;
    
    this.setData({ index });
    if (List[index].ImgShow.length){
      let TImgList = [];
      for (let v in List[index].ImgShow){
        TImgList.push(List[index].ImgShow[v].AttachPath)
      }
      this.setData({ TImgList });
      this.setData({ activeMaks:true });
    }else{
      this.setData({ TImgList:[]});
      // this.MakeSureShare()
      this.setData({ activeMaks: true });
    }
  },
  MakeSureShare(){
    let CommentObj = this.data.List[this.data.index];
    let obj = {
      id: CommentObj.Id,
      jsonData: JSON.stringify({
        Comment: CommentObj.Comment,
        ProductTitle: '',
        ImgShow: this.data.TImgList
      })
    }
    app.globalData.post('index/SaveProductCommentShare',obj).then(res=>{
      wx.navigateTo({
        url: '/pages/TheEvaluationList/ShareEvaluationDetail/ShareEvaluationDetail?key=' + res.data.key,
      })
    })
  }
})