let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    num:{
      type:Number,
      observer(val){
        console.log(val);
      }
    },
    isShow:{
      type:Boolean,
    },
    PID:{
      type:Number,
      observer(val){
        this.setData({ loadingdata: true })
        app.globalData.post('index/getproductdetail', { productId:val}).then(res=>{
          let obj = res.data.object;
          this.setData({ detail: res.data.object, loadingdata:false });
          this.getLstAttPrice(obj.LstAtt);
          {
            //该代码块用于渲染默认规格
            //一级规格
            obj.LstAtt.length == 1 ? this.reRenderLevel_1(obj) : ''

            //二级规格
            obj.LstAtt.length == 2 ? this.reRenderLevel_2(obj).then(res => {
              let _list = [];
              // this.setData({ OneIndex: res[0], TwoIndex:res[1]}); //初始化默认选取规格 用于提交订单
              // obj.LstAtt[0].LstAttValue[res[0]].activeIndex = res[0]; //初始化默认选取规格
              // obj.LstAtt[1].LstAttValue[res[1]].activeIndex = res[1]; //初始化默认选取规格
              _list.push(obj.LstAtt[0].LstAttValue[res[0]]);
              _list.push(obj.LstAtt[1].LstAttValue[res[1]]);
              this.setData({
                _LstAtt: obj.LstAtt,
                packList: _list,
              });
            }) : null;
          }
        })
      }
    },
    GroupNo:{
      type:String,
      observer(val) {
        
      }
    },
    //0为加入购物车
    //非0为购买
    OrderType:{
      type:Number,
    },
    //当前购物车对象ID
    CardId:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadingdata:true,
    num:1,
    _LstAtt:[],
    packList:[],
    selectItemList:[],
    //二级
    CAry:[],
    // OneIndex:0,
    // TwoIndex:0,
    isOrderIng:false,
    activeRule:false,
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
        resolve(topPrice)
      })
    },
    //是否改变数量
    onChangeNum(e) {
      console.log(this.properties.CardId);
      let obj = {
        itemid: this.properties.CardId,
        num: e.detail
      }
      app.globalData.post('order/changeshoppingcart', obj).then(res => {
        res.data.success == 200 ? this.triggerEvent('getList',{}) : null
      })
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
    //选择规格
    pickItem(e) {
      let Event = e.target.dataset; //获取事件对象
      let list = this.data._LstAtt; //获取规格列表
      let TargetList = list[Event.listkey].LstAttValue; //获取点击Item对应的列表   
      //重置所有选中状态

      // 如果为disable状态，则不允许状态
      if(Event.disabled){
        // app.globalData.toast('该规则暂时没有库存!')
        return
      }
      for(let k in TargetList){
        TargetList[k].activeIndex = null;
      }
      //选中点击状态
      list[Event.listkey].LstAttValue[Event.itemkey].activeIndex = Event.itemkey;
      this.setData({ _LstAtt: list },()=>{
        this.reSetActiveLabel(list); //重置选中Label
      });
      this.data._LstAtt.length==2 && Event.listkey ? 
      this.setData({ TwoIndex: e.target.dataset.itemkey },()=>{  

          this.triggerEvent('emitPickGoodObj', 
                          { PickGoodObj: this.data.CAry[this.data.OneIndex][this.data.TwoIndex]})

      }) : this.setData({ OneIndex: e.target.dataset.itemkey },()=>{
          if (this.data._LstAtt.length == 2){ //二级规格
            if (this.data.CAry[this.data.OneIndex][this.data.TwoIndex].Stock){  //如果该一级规格对应的二级规格有库存
            
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
              list[1].LstAttValue[index].activeIndex = Number(index);
              this.setData({ TwoIndex: index, _LstAtt:list},()=>{
                this.reSetActiveLabel(list); 
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
      // if (this.data.isOrderIng){
      //   return
      // }
      this.setData({ isOrderIng:true});
      if(this.data.num == 0){
        app.globalData.toast('商品数量不能为0');
        return
      }else{
        let attids = '';//目标商品规格

        //一级规格
        if(this.data._LstAtt.length == 1) {
          try{
            let OneIndex = this.data.OneIndex;
            attids = this.data.CAry[OneIndex].AttIds;
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
            attids = AttIds;
          } catch(error){
            app.globalData.toast('请先选择规格!');
            this.setData({ isOrderIng: false });
            return
          }
        }
        app.globalData.post('Order/ChangeShoppingCartSku', { id: this.properties.CardId, attid: attids }).then(res=>{
            this.setData({ isOrderIng: false });
            if(res.data.success==200){
              this.triggerEvent('getList', {});
              this.triggerEvent('hide', {}, {})
            }
        })
      }
    },
    // 重新获取购物车数量
    reGetCarNum(){
      this.hide();
      this.triggerEvent('reGetCarNum', {}, {});
      
    },
    // 渲染一级规格状态
    reRenderLevel_1(obj){
      let Target = obj.LstAtt[0].LstAttValue;
      let packList = [];
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
        if(CAry[v].Stock){
          ActiveIndex = v;
          break;
        }
      }
      // Target[ActiveIndex].activeIndex = ActiveIndex;  //初始化默认选项
      // this.reSetActiveLabel(obj);
      
      packList.push(obj.LstAtt[0].LstAttValue[ActiveIndex]);
      this.setData({
        _LstAtt: obj.LstAtt,
        packList: packList,
        CAry: CAry
      });
    },
    // 渲染二级规格状态
    reRenderLevel_2(obj){
      let index = 0;
      let CAry = new Array();
      for (let c in obj.LstAtt[0].LstAttValue){
        let r = [];
        for (let t in obj.LstAtt[1].LstAttValue){
          r.push(obj.LstSKU[index]);
          index++;
        }
        CAry.push(r);
      }
      this.setData({ CAry: CAry });
      return Promise.all([this.getActiveLevel(obj, true), this.getActiveLevel(obj, false)]) //初始化默认选项
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
