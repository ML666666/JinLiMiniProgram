// pages/GeneralItemDescription/component/LuckyDouble/LuckyDouble.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object,
      observer(obj){
        this.setData({ list:this.renderList(obj.TowGroup.list) },()=>{
          let length = Math.ceil(this.data.list.length / 2);
          let r = 0;
          let index = 0;
          let array = [];
          let allarray = [];
          for (let i = 0; i < this.data.list.length;i++){
            array[array.length] = i;
            if (array.length == 2 || (i == this.data.list.length - 1 && index + 1 == length)){
              allarray[index] = array;
              index++;
              array = [];
            }
          }
          this.setData({ allarray })
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    isShowAll:false,
    isShowMakeSure:false,
    targetObj:null
  },
  ready(){
    setInterval(()=>{
      this.setData({ list: this.renderList(this.data.list) });
    },1000)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showAll(){
      this.setData({ isShowAll: !this.data.isShowAll })
    },
    isLogin(){
      if (wx.getStorageSync('userInfo')) {
        return wx.getStorageSync('userInfo')
      } else {
        wx.showModal({
          title: '提示',
          content: '未登录，是否前往登录页',
          showCancel: true,
          success() { wx.navigateTo({ url: '/pages/Login/Login' }) },
        })
        return false;
      }
    },
    toGetToge(e){
      let index = e.currentTarget.dataset.index;
      this.setData({ targetIndex: index});
      this.setData({ isShowMakeSure:true });
      this.setData({ type: e.currentTarget.dataset.type });
      this.setData({ GroupNo: e.currentTarget.dataset.groupno });
      // this.setData({ isShowAll: false });
      // return
      // this.setData({ isShowAll: false });
      // this.triggerEvent('setOrder', { type: e.currentTarget.dataset.type, GroupNo: e.currentTarget.dataset.groupno }, {}); 
    },
    isToShowMakeSure(){
      this.setData({ isShowMakeSure: false });
    },
    toBd(){
      this.setData({ isShowAll: false });
      this.setData({ isShowMakeSure:false });
      this.triggerEvent('setOrder', { type: this.data.type, GroupNo: this.data.GroupNo }, {}); 
    },
    renderList(list){
      for (let v in list){
        let leftTime = list[v].EndTotalSeconds;
        let hours = parseInt(leftTime / 60 / 60 % 24, 10);//计算剩余的小时
        let minutes = parseInt(leftTime  / 60 % 60, 10);//计算剩余的分钟
        let seconds = parseInt(leftTime  % 60, 10);//计算剩余的秒数
        let EndTimeStr = `剩余${hours}:${minutes}:${seconds}`;
        list[v].EndTimeStr = EndTimeStr;
        list[v].EndTotalSeconds = list[v].EndTotalSeconds-1;
      }
      return list
    }
  }
})
