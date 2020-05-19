Component({
  data: {
    selected: 0,
    color: "#2c3e50",
    selectedColor: "#ff273b",
    list: [
      {
        "iconPath": "/image/home.png",
        "selectedIconPath": "/image/homeActive.png",
        "pagePath": "/pages/index/index",
        "text": "首页"
      },
      {
        "iconPath": "/image/search.png",
        "selectedIconPath": "/image/searchActive.png",
        "pagePath": "/pages/search/search",
        "text": "搜索"
      },
      {
        "iconPath": "/image/member.png",
        "selectedIconPath": "/image/memberActive.png",
        "pagePath": "/pages/AngelGiftBag/AngelGiftBag",
        "text": "天使会员"
      },
      {
        "iconPath": "/image/card.png",
        "selectedIconPath": "/image/cardActive.png",
        "pagePath": "/pages/card/card",
        "text": "购物车"
      },
      {
        "iconPath": "/image/me.png",
        "selectedIconPath": "/image/meActive.png",
        "pagePath": "/pages/me/me",
        "text": "我的"
      }
    ]
  },
  attached() {
    let selected = wx.getStorageSync('selected') ? wx.getStorageSync('selected'):0;
    wx.setStorageSync('selected', selected)
    this.setData({ selected: selected});
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(data.index)
      wx.setStorageSync('selected', data.index)
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})