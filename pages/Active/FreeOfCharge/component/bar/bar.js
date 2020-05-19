// pages/Active/FreeOfCharge/component/bar/bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isaboutme:{
      type:Number,
      observer: function (val) {
        console.log(val);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    changePage(e){
      let isaboutme = e.currentTarget.dataset.isaboutme;
      this.triggerEvent('changeTab', {isaboutme});
    }
  }
})
