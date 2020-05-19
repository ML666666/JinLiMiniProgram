// pages/GeneralItemDescription/component/toOder/toOder.js
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow:{
      type:Boolean
    },
    GroupNo:{
      type:String,
    },
    isactive:{
      type:Boolean
    },
    detail:{
      type:Object,
      observer(obj) {
        
        // 初始化商品规格 默认选第一个
        // obj.LstSKU[0].Stock = 0;
        // obj.LstSKU[14].Stock = 0;
        // obj.LstSKU[2].Stock = 0;
        // obj.LstSKU[3].Stock = 0;
        // obj.LstSKU[4].Stock = 0;
        // obj.LstSKU[5].Stock = 0;
        if (this.data.isFristRenderData){
          this.setData({ isFristRenderData:false });
          this.setData({ Type: obj.ActivityInfo.Type })
          this.setData({ GoodId: obj.Id })
          this.setData({ ActivityInfoType: obj.ActivityInfo.Type });//活动类型
          this.getLstAttPrice(obj.LstAtt);
          let e = (index)=>{ //模拟第一次点击事件对象
            return {
              target: {
                dataset: {
                  attid: obj.LstAtt.length == 2 ? obj.LstAtt[index].AttId : obj.LstAtt[0].AttId,
                  id: obj.LstAtt.length == 2 ? obj.LstAtt[index].LstAttValue.AttValueId : obj.LstAtt[0].LstAttValue[index].AttValueId,
                  disabled: false,
                  itemkey: index,
                  listkey: 0
                }
              }
            }
          }
          { //该代码块用于渲染默认规格
            //一级规格
            obj.LstAtt.length == 1 ? this.reRenderLevel_1(obj).then(res=>{ 
              // res为有库存的SKU下标
              console.log(res);
              // return
              obj.ProductType == 7 ? this.pickItem(e(res)) : null; // obj.ProductType为7表示给商品为苏宁商品默认勾选一个SKU
            }) : null

            //二级规格
            
            obj.LstAtt.length == 2 ? this.reRenderLevel_2(obj).then(res => {
              let _list = [];
              // this.setData({ OneIndex: res[0], TwoIndex:res[1]}); //初始化默认选取规格 用于提交订单
              // obj.LstAtt[0].LstAttValue[res[0]].activeIndex = res[0]; //初始化默认选取规格
              // obj.LstAtt[1].LstAttValue[res[1]].activeIndex = res[1]; //初始化默认选取规格
              // _list.push(obj.LstAtt[0].LstAttValue[res[0]]);
              // _list.push(obj.LstAtt[1].LstAttValue[res[1]]);
              this.setData({
                _LstAtt: obj.LstAtt,
                // packList: _list,
              },()=>{
                // obj.ProductType为7表示给商品为苏宁商品默认勾选一个SKU
                if(obj.ProductType == 7){
                  this.pickItem({
                    target: {
                      dataset: {
                        attid: obj.LstAtt[0].AttId,
                        id: obj.LstAtt[0].LstAttValue[res[0]].AttValueId,
                        disabled: false,
                        itemkey: res[0],
                        listkey: 0
                      }
                    }
                  }, false);
                  this.pickItem({
                    target: {
                      dataset: {
                        attid: obj.LstAtt[1].AttId,
                        id: obj.LstAtt[1].LstAttValue[res[1]].AttValueId,
                        disabled: false,
                        itemkey: res[1],
                        listkey: 1
                      }
                    }
                  }, false)
                }
          
              });
            }) : null;
          }

        }
        
      }
    },
    //0为加入购物车
    //非0为购买
    OrderType:{
      type:Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num:1,
    _LstAtt:[],
    // packList:[],
    selectItemList:[],
    //二级
    CAry:[],
    // OneIndex:0,
    // TwoIndex:0,
    isOrderIng:false,
    activeRule:false,
    isFristRenderData:true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getLstAttPrice(LstAtt) { //价格排序
      return new Promise((resolve, reject) => {
        let _LstAtt = []
        for (let v in LstAtt[0].LstAttValue) {
          for (let e in LstAtt[0].LstAttValue[v].SKU) {
            _LstAtt.push(LstAtt[0].LstAttValue[v].SKU[e]);
          }
        }
        _LstAtt.sort(function (a, b) { return a.SalePrice - b.SalePrice });
        let topPrice = _LstAtt[0].SalePrice;
        let lastPrice = _LstAtt[_LstAtt.length - 1].SalePrice;
        this.setData({ topPrice });
        this.setData({ lastPrice });
        this.setData({ topPriceShoppingBi: _LstAtt[0].ShoppingBi})
        resolve(topPrice)
      })
    },
    toActiveRule(){
      this.setData({ activeRule:true})
    },
    hideRule(){
      this.setData({ activeRule:false })
    },
    hide(){
      this.triggerEvent('hide', {}, {})
    },
    getStock(){
      if (this.data._LstAtt.length == 0){
        return this.properties.detail.ProductStock
      }
      if (this.data._LstAtt.length == 1) {
        return this.data.CAry[this.data.OneIndex].Stock;
      }
      if (this.data._LstAtt.length == 2) {
        return this.data.CAry[this.data.OneIndex][this.data.TwoIndex].Stock;
      }
    },
    // 改变下单礼品数量
    changeNum(e){
      // type为0为减少 type为1为增加
      let type = e.target.dataset.type;
      let num = this.data.num;
      let Stock = this.getStock();

      //减少数量
      if (type == 0) {
        num == 0 ? '' : this.setData({ num: num - 1 });
      }
      //增加
      if (type == 1){
        num == Stock ? '' : this.setData({ num: num+1 });
      }
      if (type == 2){
        let value = parseInt(e.detail.value);
        if (isNaN(value))
        {
          this.setData({num:0})
        }else{
          parseInt(value) > 0 && parseInt(value) <= Stock ? this.setData({ num: parseInt(value)},()=>{
            this.data.num>Stock?this.setData({num:Stock}):'';
          }) : this.setData({ num: 0 });
        }
      }

    },
    // 取消选择状态
    unpickItem(Event){
      let list = this.data._LstAtt; //获取规格列表
      list[Event.listkey].LstAttValue[Event.itemkey].activeIndex = null;
      Event.listkey == 0 ? this.setData({ OneIndex:null }) : this.setData({ TwoIndex:null });
      this.setData({ _LstAtt: list });
    },
    //选择规格
    pickItem(e,isSelect=false) {
      console.log(e);
      let goodObj = this.properties.detail;
      let Event = e.target.dataset; //获取事件对象
      let list = this.data._LstAtt; //获取规格列表
      let TargetList = list[Event.listkey].LstAttValue; //获取点击Item对应的列表   
      //如为选择状态则取消选择状态  == 反选
      if (Event.isactive) {
        this.unpickItem(Event);
        return
      }
      // 如果为disable状态，则不允许状态
      if(Event.disabled){
        // app.globalData.toast('该规则暂时没有库存!')
        return
      }
      for(let k in TargetList){
        TargetList[k].activeIndex = null;
      }
      // //选中点击状态
      list[Event.listkey].LstAttValue[Event.itemkey].activeIndex = Event.itemkey;
      this.setData({ _LstAtt: list });
      this.data._LstAtt.length==2 && Event.listkey ? 
      this.setData({ TwoIndex: e.target.dataset.itemkey },()=>{  

          typeof this.data.TwoIndex == 'number' || typeof this.data.TwoIndex == 'string' ?this.triggerEvent('emitPickGoodObj', 
                          { PickGoodObj: this.data.CAry[this.data.OneIndex][this.data.TwoIndex]}):null

      }) : this.setData({ OneIndex: e.target.dataset.itemkey },()=>{

          typeof this.data.TwoIndex == 'number' || typeof this.data.TwoIndex == 'string' ? this.triggerEvent('emitPickGoodObj',
            { PickGoodObj: this.data.CAry[this.data.OneIndex][this.data.TwoIndex] }) : null;

          if (this.data._LstAtt.length == 2){ //二级规格
            if (!isSelect){
              return
            }
            if (this.data.TwoIndex&&this.data.CAry[this.data.OneIndex][this.data.TwoIndex].Stock){  //如果该一级规格对应的二级规格有库存
            
              this.triggerEvent('emitPickGoodObj',
                { PickGoodObj: this.data.CAry[this.data.OneIndex][this.data.TwoIndex] })

            }else{ 
              //否则则取该一级规格下有库存的二级规格
              let index = -1;
              for (let v in this.data.CAry[this.data.OneIndex]){
                if (this.data.CAry[this.data.OneIndex][v].Stock){
                  index = v;
                  break;
                }
              }

              //清除状态
              let list = this.data._LstAtt;
              for(let e in list){
                if (e>0){
                  for (let w in list[e].LstAttValue) {
                    list[e].LstAttValue[w].activeIndex = null
                  }
                }
              }

              // for (let v in list[1].LstAttValue[index]){
              //   list[1].LstAttValue[index].activeIndex = 0;
              // }
              if (index == -1){ //如果index == -1 则表示该一级SKU下对应的二级SKU全部没有库存
                return
              }
              list[1].LstAttValue[index].activeIndex = Number(index);
              this.setData({ TwoIndex: index, _LstAtt:list},()=>{
                // this.reSetActiveLabel(list); 
                this.triggerEvent('emitPickGoodObj',
                  { PickGoodObj: this.data.CAry[this.data.OneIndex][this.data.TwoIndex] })
              })

            }

          }else{

            this.triggerEvent('emitPickGoodObj',
              { PickGoodObj: this.data.CAry[this.data.OneIndex] })

          }
      }) 

      
    },
    //重新生成 选择的Label
    reSetActiveLabel(TagetList) {
    
      let _list = [];
      for (let k in TagetList) {
        for (let t in TagetList[k].LstAttValue) {
          TagetList[k].LstAttValue[t].activeIndex != null ? _list.push(TagetList[k].LstAttValue[t]) : '';
        }
      }
      this.setData({ packList: _list.length > 2 ? _list.slice(0,2):_list });
    },
    toMakeSureOrder(e){
      
      let type = Number(e.currentTarget.dataset.type); //0为加入购物车
      if (this.data.isOrderIng && type == 1){
        return
      }
      this.setData({ isOrderIng:true});
      // let goodtype = this.properties.detail.goodtype;
      if(this.data.num == 0){
        app.globalData.toast('商品数量不能为0');
        return
      }else{
        // let type = this.properties.OrderType; //0为加入购物车
        let requestUrl = type ? 'order/buyitnow':'order/addshoppingcart';
        let nextPageUrl = type ? this.properties.isactive?
          `/pages/TmakeSureOrder/TmakeSureOrder?ProductType=${this.properties.detail.ProductType}&GroupNo=${this.properties.GroupNo}&isFromDtActive=${this.properties.isactive}&ActivityInfoType=${this.data.ActivityInfoType}&GoodId=${this.data.GoodId}` : `/pages/makeSureOrder/makeSureOrder?ProductType=${this.properties.detail.ProductType}&GroupNo=${this.properties.GroupNo}&ActivityInfoType=${this.data.ActivityInfoType}`:
        '/pages/card/card';
        let productid = this.properties.detail.Id;//目标商品Id
        let buynum = this.properties.isactive ? 1 : this.data.num;//目标商品Id
        let attids = '';//目标商品规格
        let obj = {
          buynum,
          productid
        };
        //需传参数

        // 无规格
        if (this.data._LstAtt.length == 0){
          obj['attids'] = "";
        }
        //一级规格
        if(this.data._LstAtt.length == 1) {
          try{
            let OneIndex = this.data.OneIndex;
            attids = this.data.CAry[OneIndex].AttIds;
            obj['attids'] = attids;
          } catch (error) {
            app.globalData.toast('请先选择规格!');
            this.setData({ isOrderIng: false });
            return
          }
        }
        //二级规格
        if(this.data._LstAtt.length == 2){
          try{
            let OneIndex = this.data.OneIndex;
            let TwoIndex = this.data.TwoIndex;
            let AttIds = this.data.CAry[OneIndex][TwoIndex].AttIds;
            obj['attids'] = AttIds;
            if (AttIds == undefined){
              throw '该商品为苏宁无规格商品，没有库存'
            }
          
          } catch(error){
            app.globalData.toast('请先选择规格!');
            this.setData({ isOrderIng: false });
            return
          }
        }
        obj['orderType'] = type? this.properties.detail.ProductType : null;

      
        let post = app.globalData.post(requestUrl, obj).then(res => {
          setTimeout(() => { this.setData({ isOrderIng: false });},1000)
          type==0?app.globalData.toast(res.data.msg):null;
          if(res.data.success == 200){
            type ? wx.navigateTo({ url: nextPageUrl }) : this.reGetCarNum()
          }else{
            // 如失去登录状态则重新登录
            app.globalData.toast(res.data.msg);
            res.data.success==400?setTimeout(()=>{
              wx.navigateTo({
                url: '/pages/Login/Login',
              })
            },300):null
          } 
        }).catch(res=>{
          setTimeout(() => { this.setData({ isOrderIng: false }); }, 1000)
        });

      }
    },
    // 重新获取购物车数量
    reGetCarNum(){
      this.hide();
      this.triggerEvent('reGetCarNum', {}, {});
    },
    // 渲染一级规格状态
    reRenderLevel_1(obj){
      let goodObj = this.properties.detail;
      let Target = obj.LstAtt[0].LstAttValue;
      // let packList = [];
      let CAry = [];
      let ActiveIndex = 0;

      let index = 0;
      for (let v in obj.LstSKU){
       
        let id = Target[index]?Target[index].AttValueId.toString():null;
        if(obj.LstSKU[v].AttIds.includes(id)){
          CAry.push(obj.LstSKU[v]);
          index++;
        }
      }

      for (let v in CAry) { //获取初始化默认选项
        if (CAry[v].ProductId == goodObj.ProductId){
          ActiveIndex = v;
          break;
        }
      }
      // Target[ActiveIndex].activeIndex = ActiveIndex;  //初始化默认选项
      // this.reSetActiveLabel(obj);
      // packList.push(obj.LstAtt[0].LstAttValue[ActiveIndex]);
      this.setData({
        _LstAtt: obj.LstAtt,
        // packList: packList,
        CAry: CAry
      });
      return new Promise((resolve,reject)=>{
        resolve(ActiveIndex)
      })
    },
    // 渲染二级规格状态
    reRenderLevel_2(obj){
      let goodObj = this.properties.detail;
      let SLAT = []; //苏宁默认商品选中数组
      let index = 0;
      let CAry = new Array();
      for (let c in obj.LstAtt[0].LstAttValue){
        let r = [];
        for (let t in obj.LstAtt[1].LstAttValue){
          let oneLstAtt = obj.LstAtt[0];
          let twoLstAtt = obj.LstAtt[1];
          let attid = `${oneLstAtt.AttId}:${oneLstAtt.LstAttValue[c].AttValueId}|${twoLstAtt.AttId}:${twoLstAtt.LstAttValue[t].AttValueId}`;
          let SKU = obj.LstSKU.find(item => item.AttIds == attid)
          if (SKU){
            if (SKU.ProductId == goodObj.ProductId){
              SLAT[0] = c;
              SLAT[1] = t;
            }
            r.push(SKU)
          }else{
            r.push({ Stock:0 })
          }
          //该操作针对苏宁商品，如没有库存(苏宁不会返回对应的SKU)则将Stock置为0（则我们自己模拟一个SKU并将库存置未0，对应视图就是将选项置灰）
          index++;
        }
        CAry.push(r);
      }
      this.setData({ CAry: CAry });
      //如为苏宁商品则返回默认商品对应二维下标，否则为普通商品 返回有库存的第一个商品的二维下标
      return goodObj.ProductType == 7 ? Promise.all(SLAT): Promise.all([this.getActiveLevel(obj, true), this.getActiveLevel(obj, false)]) //初始化默认选项
    },
    // 获取初始化Item的index
    getActiveLevel(obj,isLevelOne){  
      return new Promise((resolve,reject)=>{
        let index = 0;
        let ActiveIndex = 0;
        for (let c in obj.LstAtt[0].LstAttValue) {
          for (let t in obj.LstAtt[1].LstAttValue) {
            if (obj.LstSKU[index].Stock) {
              isLevelOne ? ActiveIndex = c : ActiveIndex=t;
              resolve(ActiveIndex);
              return false;
            }
            index++;
          }
        }
      })
    }

  }
})
