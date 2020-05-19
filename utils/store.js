import Store from '../gob/store.js';

export default new Store({
  state: {
    wsUrl:'test',
    SocketObj:{ //弹窗对象
      Code:-1
    },
    isGetDataFail:false,
    TestSocketObj:{
      Code:1003,
      Data:{
        list:[
          {
            EndTime: "/Date(1564726466000)/",
            GroupNo: "fe13171973f74e6fae18a8588942095f",
            Id: 17864,
            MemberId: 327766,
            OpenTime: null,
            OrderId: 433670,
            OrderTime: "/Date(1564553666000)/",
            ProductId: 76617,
            Status: null,
            TIndex: 1,
    UserIcon:"http://thirdwx.qlogo.cn/mmopen/vi_32/Z57pZiaDfspNHKsUqtNtyB4MlzZqQhBMwQDqzibic2O4yOoNhTc8Yfm3yVGdXelDHq5wPZjErpTzKDtWmiaWRo8t6w/132?v=1.0.1",
            UserName: "test",
            WinStatus: 0
          },
          {
            EndTime: "/Date(1564726495000)/",
            GroupNo: "fe13171973f74e6fae18a8588942095f",
            Id: 17865,
            MemberId: 257600,
            OpenTime: null,
            OrderId: 433671,
            OrderTime: "/Date(1564553695000)/",
            ProductId: 76617,
            Status: null,
            TIndex: 2,
            UserIcon: "https://wx.qlogo.cn/mmopen/vi_32/nKIHuWlnOCt4JSDXrnx0zTeLsibkjibku6HuHCZmK2InDOmqR6xPRuyoPPpcSYeHKv9kCMXicTSibdich0hvjbf1ucg/132",
            UserName: "Null",
            WinStatus: 0,
          }
        ],
        BuyPrice: 188,
        MarketPrice: 198,
        OrderId: 433671,
        ProductImg: "http://h5.taobaby.cn/Upload/Comment/20180919115710184.jpg_thumb.jpg?v=1.0.1",
        ProductTitle: "大益茶叶 普洱茶生茶 普知味生茶礼盒装 357g/盒",
        TipMsg: "很遗憾，差点免单",
        WinStatus: 1,
      },
      Message: "很遗憾，差点免单",
      Success: true
    }
  }
})