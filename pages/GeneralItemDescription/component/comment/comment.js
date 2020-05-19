// pages/GeneralItemDescription/component/comment/comment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail:{
      type:Object
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
    toGetMore(){
      console.log(this.properties.detail.Id)
      wx.navigateTo({
        url: `/pages/TheEvaluationList/TheEvaluationList?productid=${this.properties.detail.Id}`,
      })
    }
  }
})
