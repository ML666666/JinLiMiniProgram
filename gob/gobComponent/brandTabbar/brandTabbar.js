// gob/gobComponent/brandTabbar/brandTabbar.js
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
    sort: 0,
    sortDirection: false,
    gwb:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    select(e){
      let index = e.currentTarget.dataset.index;
      let gwb = e.currentTarget.dataset.gwb;
      this.setData({ gwb: e.currentTarget.dataset.gwb, activeIndex:index, sort:3 },()=>{
        this.setData({ isShowList: false });
        this.triggerEvent('getStatus', {
          sort: 0,
          sortDirection: this.data.sortDirection,
          gwb: this.data.gwb
        })
      })
    },
    tap(e) {
      let sort = e.currentTarget.dataset.sort;
      if (sort != 3){
        this.data.sort == sort && (sort == 2) ?
          this.setData({ sortDirection: !this.data.sortDirection }) :
          this.setData({ sortDirection: false })
        this.setData({ sort }, () => {
          this.triggerEvent('getStatus', {
            sort: this.data.sort,
            sortDirection: this.data.sortDirection,
            gwb: '',
          })
        })
        this.setData({ isShowList:false })
      }else{
        this.setData({ isShowList: !this.data.isShowList })
      }
    },
  }
})
