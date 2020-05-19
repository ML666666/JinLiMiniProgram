// pages/me/page/AngelDetail/page/MyEarnings/lastWeek/listWrapper/listWrapper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    active:1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setActive(e){
      let active = e.currentTarget.dataset.index
      this.setData({ active });
    }
  }
})
