const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  lifetimes:{
    detached(){
      clearInterval(this.data.timer);
    }
  },
  properties: {
    param: {
      type: Object,
      observer(val) {
      
        if (this.data.DataObj) {
          return
        }
        //该程序只执行一次
        this.renderData();
      }
    },
    imgDomain: {
      type: String
    },
    imgVersion: {
      type: String
    },
    NowData: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timer:null,
    CountDownDay:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    renderData(){
      let val = this.properties.param;
      console.log(val);
      let CountDown = this.getCountDown();
      app.globalData.post('Special/GetSpecialAreaProduct', { SpecialAreaId: val.special_number, pagesize: 3 }).then(res => {
        res.data.success == 200 ?
          this.setData({ DataObj: res.data, isOver: false }, () => {
            // 获取倒计时
            let TotalMilliseconds = 
                    res.data.TotalMilliseconds>= 
                              CountDown ? 
                                    CountDown : 
                                        res.data.TotalMilliseconds;

            this.setData({ TotalMilliseconds: TotalMilliseconds / 1000 }, () => {
              res.data.TotalMilliseconds
              this.renderList();
              this.data.timer = setInterval(() => {this.renderList();}, 1000)
            })
          }) : this.setData({ isOver: true })
      })
    },
    renderList(EndTime = this.data.TotalMilliseconds) {
      let Days = parseInt(EndTime / 1000 / 60 / 60 / 24, 10); //计算剩天
      let Hours = parseInt(EndTime / 60 / 60 % 24, 10); //计算剩余的小时
      let Minutes = parseInt(EndTime / 60 % 60, 10); //计算剩余的分钟
      let Seconds = parseInt(EndTime % 60, 10); //计算剩余的秒数
      EndTime = EndTime-1;
      this.setData({ TotalMilliseconds: EndTime, Days, Hours, Minutes, Seconds},()=>{
        if (this.data.TotalMilliseconds <= 0) {
          let CountDownDay = this.data.CountDownDay+1;
          this.setData({ isOver: true, CountDownDay},()=>{
            clearInterval(this.data.timer);
            this.renderData()
          });
        }
      })

    },
    getCountDown(){
      let data = new Date();
      let year = data.getFullYear();
      let mouth = data.getMonth() + 1;
      let day = data.getDate();
      let now = new Date().getTime();
      let entDate = Date.parse(`${year}-${mouth}-${day}-24:00`);
      let countDown = entDate - now;
      return countDown;
    },
    click(e){
      wx.navigateTo({
        url: '/pages/SpecialPage/SpecialPage?SpecialAreaId=' + this.properties.param.special_number,
      })
    }
  }
})
