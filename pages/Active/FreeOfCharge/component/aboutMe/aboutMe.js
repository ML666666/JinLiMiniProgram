const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    member:{ //用户中心
      type:Object,
      observer: function (val) { 
        let OrderListObj = this.data.OrderListObj;
        this.getOrderList().then(res => {
          OrderListObj.OrderList = [...res.data.rows];
          OrderListObj.isOver = res.data.rows.length < this.data.pageSize ? true : false;
          OrderListObj.isLoading = false;
          this.setData({ OrderListObj });
        })
      }
    },
    userInfoGetList:{ //是否加载更多
      type:Boolean,
      observer: function (val) { 
        if (this.data.active==1){
          let OrderListObj = this.data.OrderListObj;
          if (OrderListObj.isOver){
            return
          }
          OrderListObj.isLoading = true;
          let pageIndex = OrderListObj.pageIndex+1;
          this.setData({ OrderListObj });
          this.getOrderList(pageIndex).then(res => {
            OrderListObj.OrderList = [...OrderListObj.OrderList,...res.data.rows];
            OrderListObj.pageIndex = pageIndex;
            OrderListObj.isOver = res.data.rows.length < this.data.pageSize ? true : false
            this.setData({ OrderListObj });
          })
        }else{
          let MyGoldCoinRecord = this.data.MyGoldCoinRecord;
          if (MyGoldCoinRecord.isOver) {
            return
          }
          MyGoldCoinRecord.isLoading = true;
          let pageIndex = MyGoldCoinRecord.pageIndex + 1;
          this.setData({ MyGoldCoinRecord });
          this.getMyGoldCoinRecord(pageIndex).then(res => {
            MyGoldCoinRecord.OrderList = [...MyGoldCoinRecord.OrderList, ...res.data.records];
            MyGoldCoinRecord.pageIndex = pageIndex;
            MyGoldCoinRecord.isOver = res.data.records.length < this.data.pageSize ? true : false
            this.setData({ MyGoldCoinRecord });
          })
        }
      } 
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    haveLoad:false,//是否加载数据
    member:{},
    active:1,
    pageSize:8,
    OrderListObj:{
      pageIndex: 1,
      OrderList: [],
      isOver:false,
      isLoading:true
    },
    MyGoldCoinRecord:{
      pageIndex: 1,
      OrderList: [],
      isOver: false,
      isLoading: true
    }
  },
  ready(){
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    reSetData(){
      this.getOrderList().then(res => {
        this.setData({ OrderList: [...res.data.rows] });
      })
    },
    // 获取订单明细
    getOrderList(pageIndex=1){
      let obj = {
        pageIndex: pageIndex,
        pageSize: this.data.pageSize
      }
      return app.globalData.post('Solitaire/getMyOrder',obj)
    },
    changeTabs(e){
      let active = e.currentTarget.dataset.index;
      this.setData({active},()=>{
        //如当前ActiveIndex为2且缓存中没有购物币明细数据，则向后台发送数据请求接口
        let MyGoldCoinRecord = this.data.MyGoldCoinRecord;
        this.data.active == 2 && this.data.MyGoldCoinRecord.OrderList.length == 0 ? this.getMyGoldCoinRecord().then(res=>{
          MyGoldCoinRecord.OrderList=[...res.data.records];
          MyGoldCoinRecord.isOver = res.data.records<this.data.pageSize?true:false;
          MyGoldCoinRecord.isLoading = false;
          this.setData({ MyGoldCoinRecord})
        }):null
      });
    },
    // 获取金币明细
    getMyGoldCoinRecord(pageIndex=1){
      let obj = {
        pageIndex: pageIndex,
        pageSize: this.data.pageSize
      }
      return app.globalData.post('Solitaire/getMyGoldCoinRecord', obj)
    }

  }
})
