let date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
let daysAry = [];
daysAry[0] = days.slice(0,31);
daysAry[1] = days.slice(0,28);
daysAry[2] = days.slice(0,31);
daysAry[3] = days.slice(0,30);
daysAry[4] = days.slice(0,31);
daysAry[5] = days.slice(0,30);
daysAry[6] = days.slice(0,31);
daysAry[7] = days.slice(0,31);
daysAry[8] = days.slice(0,30);
daysAry[9] = days.slice(0,31);
daysAry[10] = days.slice(0,30);
daysAry[11] = days.slice(0,31);

const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    startTimeDay:{
      type:Number
    },
    endTimeDay:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPickStartTime:true,
    ArrowUrl:"http://h5.huizhisuo.com/upload/Picture/comment/201911/07f8a1b06cd4490ba2de76d44647aed9.png?v=1.0.43",
    isShowMask:false,
    closeUrl:'http://h5.huizhisuo.com/upload/Picture/comment/201911/f6d78f1305544da68d3f2c8d282f7fb5.png?v=1.0.43',
    years: years,
    months: months,
    days: daysAry[date.getMonth()],
    startValue: null,
    endValue: null,
  },
  attached(){
    var curTime = new Date().getTime();
    var startDate = curTime - (this.properties.startTimeDay * 3600 * 24 * 1000);
    startDate = new Date(startDate);
    if (this.properties.endTimeDay){
      var endTime = curTime - (this.properties.endTimeDay * 3600 * 24 * 1000);
      date = new Date(endTime);
    }
    this.setData({
      startValue: [startDate.getFullYear() - 1990, startDate.getMonth(), startDate.getDate() - 1],
      endValue: [date.getFullYear() - 1990, date.getMonth(), date.getDate() - 1],
    },()=>{
      this.renderTimeStr().then(res => {
          this.triggerEvent('resetTime', {
            startValue: this.data.startValueStr,
            endValue: this.data.endValueStr
          });
      });
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showMask_1(){
      this.setData({ isShowMask: true, isPickStartTime:true });
    },
    showMask_2(){
      this.setData({ isShowMask: true, isPickStartTime:false });
    },
    hideMask(){
      this.setData({ isShowMask:false });
    },
    bindChange(e){
      let val = e.detail.value;
      let year = this.data.years[val[0]]-1990;
      let month = this.data.months[val[1]]-1;
      let day = this.data.days[val[2]]-1;
      this.setData({ days: daysAry[month] })
      if(this.data.isPickStartTime){
        let startValue = [];
        startValue[0] = year; startValue[1] = month; startValue[2] = day;
        if (!this.isOkTimeStr(startValue)){
          this.setData({ startValue }, () => { this.renderTimeStr(); });
        }else{
          app.globalData.toast('开始日期不能大于结束日期！')
          this.setData({ startValue:this.data.endValue }, () => { this.renderTimeStr(); });
        }
      }else{
        let endValue = [];
        endValue[0] = year; endValue[1] = month; endValue[2] = day;
        if (!this.isOkTimeStr(this.data.startValue, endValue)) {
          this.setData({ endValue }, () => { this.renderTimeStr(); });
        } else {
          app.globalData.toast('结束日期不能小于开始日期！')
          this.setData({ endValue: this.data.startValue }, () => { this.renderTimeStr(); });
        }
      }
    },
    renderTimeStr(){
      return new Promise((resolve,reject)=>{
        let s = [...this.data.startValue];
        let e = [...this.data.endValue];
        s[0] = s[0] + 1990; s[1] = s[1] + 1; s[2] = s[2] + 1;
        e[0] = e[0] + 1990; e[1] = e[1] + 1; e[2] = e[2] + 1;
        this.setData({
          startValueStr: s.join('-'),
          endValueStr: e.join('-')
        },()=>{
          resolve(true);
        })
      })
    },
    isOkTimeStr(startValue, endValue = this.data.endValue){
      let s = [...startValue];
      let e = [...endValue];
      s[0] = s[0] + 1990; s[1] = s[1] + 1; s[2] = s[2] + 1;
      e[0] = e[0] + 1990; e[1] = e[1] + 1; e[2] = e[2] + 1;
      return Date.parse(s.join('-')) > Date.parse(e.join('-'))
    },
    changeDataType(e){
      let type = e.currentTarget.dataset.type;
      this.setData({ isPickStartTime:type==1?true:false });
    },
    makeSure(){
      this.triggerEvent('resetTime',{
        startValue: this.data.startValueStr,
        endValue: this.data.endValueStr
      });
      this.hideMask();
    }
  }
})
