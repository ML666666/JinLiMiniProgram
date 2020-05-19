const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  lifetimes: {
    attached(){
      let todayEnd = Date.parse(this.getTodayEnd());
      this.setData({ todayEnd })
      let timestamp = null;
      this.setData({ timestamp:Date.parse(new Date())})
      this.data.timer = setInterval(()=>{
        timestamp = Date.parse(new Date());
        this.setData({ timestamp })
      },1000)
      
    },
    detached(){
      clearInterval(this.data.timer);
    } 
    
  },
  properties: {
    param: {
      type: Object,
      observer(val) {
       // CountDownTimestamp = -10000 为明日开启 status = 1
       // CountDownTimestamp = -20000 为即将开抢 status = 2
       // CountDownTimestamp = -1 为已结束 status = -1
       // CountDownTimestamp > 0 为已开始 status = -1

        let active = -1; //-1代表隐藏整个秒杀模块
        let todayEnd = Date.parse(this.getTodayEnd()) //获取今日23:59:59的时间搓

        let AllList = val.list.map((item, index) => {
          item['end_time'] = `${item.start_time} ${Number(item.scene) + 4}:00`.replace(/-/g, '/');
          item['start_time'] = `${item.start_time} ${item.scene}:00`.replace(/-/g, '/');
          item['CountDownTimestamp'] = this.getCountDownTimestamp(todayEnd,item.end_time, item.start_time);
          if (item['CountDownTimestamp'] >= 0 && active < 0) {
            active = index; //先获取进行中的Active
            console.log(active);
            item['status'] = 1;
          } else if (item['CountDownTimestamp'] == -10000 || item['CountDownTimestamp'] == -20000) {
            if (active < 0 && item['CountDownTimestamp'] == -10000){
              active = index; //没有则获取进行中的Active则获取
              item['status'] = 0;
            }
            if (active < 0 && item['CountDownTimestamp'] == -20000) {
              active = index; //没有则获取进行中的Active则获取
              item['status'] = 2;
            }

          } else {
            item['status'] = -1; //否则则Active默认为-1秒杀模块隐藏
          }
          return item;
        });
        let overNum = 0;
        AllList.slice(0, 4).forEach(item=>{
           if(item['CountDownTimestamp'] == -1){
             overNum++;
           }
        });

        let list = AllList.length > 4 ? AllList.slice(0, 4) : AllList;
        AllList = AllList.length > 4 ? AllList.slice(4) : [];
   
        if (overNum == 4){
          list = AllList.length > 4 ? AllList.slice(0, 4) : AllList;
          AllList = AllList.length > 4 ? AllList.slice(4) : [];
          active = active+1-4;
        }
        this.setData({ AllList, list, active: active, todayEnd},()=>{
          this.MakeCountDownTimes()
        });
        

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
    _Num:0,
    timer:null,
    timestamp:null,
    countDowntimer:null,
    CountDownTimestamp:null,
    CountDownTimer:null,
    tList:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getTodayEnd() {
      var now = new Date();
      var y = now.getFullYear();
      var m = now.getMonth() + 1;
      var d = now.getDate();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      return y + "/" + m + "/" + d + ` 23:59:59`; 
    },  
    changeTab(e){
      this.setData({ 
          active: e.currentTarget.dataset.index},()=>{
          this.MakeCountDownTimes();
      })
    },

    // CountDownTimestamp = -10000 为明日开启 status = 1
    // CountDownTimestamp = -20000 为即将开抢 status = 2
    // CountDownTimestamp = -1 为已结束 status = -1
    // CountDownTimestamp > 0 为已开始 status = -1
    getCountDownTimestamp(todayEnd,end_time, start_time){
      end_time = end_time;
      start_time = start_time;
      if (Date.parse(new Date()) <= Date.parse(end_time) && Date.parse(new Date()) >= Date.parse(start_time)) {
        return (Date.parse(end_time) - Date.parse(new Date())) / 1000;  //进行中
      } else if (Date.parse(start_time) > Date.parse(new Date())) {
        if (Date.parse(start_time) > todayEnd) {
          return -20000; //明日开启
        }
        return -10000;  //即将开抢
      } else {
        return -1;
      }
    },
    MakeCountDownTimes(){
      this.CountDown();
      clearInterval(this.data.CountDownTimer);
      this.data.CountDownTimer = setInterval(()=>{
        this.CountDown()
      },1000);
    },
    CountDown(EndTime = this.data.list[this.data.active].CountDownTimestamp){
      let active = this.data.active;
      let list = this.data.list;
      let AllList = this.data.AllList;
      let Days = parseInt(EndTime / 1000 / 60 / 60 / 24, 10); //计算剩天
      let Hours = parseInt(EndTime / 60 / 60 % 24, 10); //计算剩余的小时
      let Minutes = parseInt(EndTime / 60 % 60, 10); //计算剩余的分钟
      let Seconds = parseInt(EndTime % 60, 10); //计算剩余的秒数
      let tlist = null;
      let isChangeActive = false; //是否已切换
      AllList = AllList.map((item, index) => { item['CountDownTimestamp'] = item['CountDownTimestamp'] - 1; return item});
      list = list.map((item,index) => {
        if(item.status){
          item['CountDownTimestamp'] = item['CountDownTimestamp'] - 1;
          if (item['CountDownTimestamp'] == 0){ //倒计时为0该场次结束
            item.status = -1; //将该场次状态设为已结束
            if(index == this.data.list.length - 1){ //如果结束场次为第四场，且还有剩余场次，则获取剩余场次
              if (AllList.length > 0){
                tlist = AllList.length > 4 ? AllList.slice(0, 4) : AllList;
                AllList = AllList.length > 4 ? AllList.slice(4) : [];
                active = 0; //重置激活第一个模块
              }else{
                active = -1; //隐藏整个秒杀模块
              }
            } else {
              active = active+1; //移动到下一个模块
            }
            isChangeActive = true
          }
        }
        return item
      });

      // list[active].CountDownTimestamp = (Date.parse(item.end_time) - Date.parse(new Date())) / 1000 - 1;

      if (isChangeActive && active != -1){
        
        setTimeout(()=>{
          list = tlist ? tlist : list;
          let item = list[active];
          let time = this.getCountDownTimestamp(this.data.todayEnd, item.end_time, item.start_time);
          list[active].CountDownTimestamp = time;
          if (time >= 0) {
            list[active].status = 1;
          } else if (time == -10000 || time == -20000) {
            if (time == -10000) {
              list[active].status = 0;
            }
            if (time == -20000) {
              list[active].status = 2;
            }
          } else {
            list[active].status = -1; //否则则Active默认为-1秒杀模块隐藏
          }
          this.setData({ list, Days, Hours, Minutes, Seconds, AllList, active });
        },2000)
      }else{
        this.setData({ list, Days, Hours, Minutes, Seconds, AllList, active });
      }
  
    },
    getPage() { //获取当前页面
      const pages = getCurrentPages();
      const perpage = pages[pages.length - 1];
      return perpage;
    },
    toGoodDetail(e){
      let status = e.currentTarget.dataset.status;
      // if (status == 0){
      //   app.globalData.toast('即将开始');
      //   return
      // }else if(status == -1){
      //   app.globalData.toast('已结束');
      //   return
      // }else if(status == 2){
      //   app.globalData.toast('明日开抢');
      // }
      // if (status==1){
      //   let id = e.currentTarget.dataset.id;
      //   let CountDownTimestamp = e.currentTarget.dataset.countdowntimestamp;
      //   wx.navigateTo({
      //     url: `/pages/SpecialPage/SpecialPage?SpecialAreaId=${id}&fromMS=${CountDownTimestamp}`,
      //   })
      // }

      let id = e.currentTarget.dataset.id;
      let CountDownTimestamp = e.currentTarget.dataset.countdowntimestamp;
      wx.navigateTo({
        url: `/pages/SpecialPage/SpecialPage?SpecialAreaId=${id}&fromMS=${CountDownTimestamp}`,
      });
      
    }
  }
})
