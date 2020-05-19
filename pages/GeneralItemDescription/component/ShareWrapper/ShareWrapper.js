const app = getApp();
const baseUrl = app.globalData.gob.config._baseUrl;
Component({
  /**
   * 组件的属性列表
   */
  pageLifetimes: {
    show: function () {
      // 1.isLogin在组件刚切入时为true，并不会触发该判断内容
      // 2.若在获取二维码阶段发现未登录后，isLogin被置为false并跳转到登陆页
      // 3.用户登录后返回改页时,用户状态为已登录且isLogin为false,便会触发改方法，重新绘制canvas
      if (!this.data.isLogin) {
        this.setData({ isLogin:true }); 
        this.renderCanvas(this.data.goodDetail);
      }
      // 1.改组件第一次载入
      if(this.data.isFrist){
        // setTimeout(() => { this.toShare(); },100)
      }
    },
    hide(){
      this.setData({isShow:false})
    }
  },
  properties: {
    LstAtt:{
      type:Array,
      observer(val){
        this.setData({ LstAtt:val})
      }
    },
    detail: {
      type: Object,
      observer(val) {
        // 将所有需渲染在canvas上的图片路径改为HTTPS
        this.setData({ goodDetail: val});
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bg_1_Url: baseUrl +'upload/Picture/comment/201912/730cccc8bcee4cc09762e5e0bc48d8bd.png?v=1.0.36',
    bg_3_url: baseUrl +'upload/Picture/comment/201912/6d7e25a0c5cf4a58ab3c5746a9c55c89.png?v=1.0.36',
    bg_2_url: baseUrl +'upload/Picture/comment/201912/b11505854e0c46a99a93824885f68e49.png?v=1.0.36',

    list:[],
    isFrist:true,
    isShow:false,
    active:0,
    haveLoadImgLength:0,
    isRender:true,
    isLogin:true,
    navHeight: app.globalData.navHeight,
    allTypeImgPathList:[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    renderLocalImage(){
      return new Promise((resolve,reject)=>{
        let list = [this.data.bg_1_Url, this.data.bg_2_url, this.data.bg_3_url]
        Promise.all(list.map((item) => { return this.getNetWorkImageInfo(item) })).then((list)=>{
          this.setData({
            bg_1_Url: list[0],
            bg_2_url: list[1],
            bg_3_url: list[2]
          },()=>{
            resolve(true)
          })
        })
      })
    },
    setClipboardData(){
      let goodDetail = this.data.goodDetail;
      let LstAtt = this.data.goodDetail.LstAtt;
      let LstStr = "";
      for (let v in LstAtt){
        LstStr = LstStr + LstAtt[v].AttName+":";
        for (let e in LstAtt[v].LstAttValue){
          LstStr = LstStr + LstAtt[v].LstAttValue[e].AttValue + ",";
        }
        LstStr = LstStr.substr(0, LstStr.length - 1) + '\n';
      }
      let shareMsg = `${goodDetail.ProductTitle}` + '\n' + 
      `${goodDetail.Share.Describe}` + '\n' + 
      `商品货号:${goodDetail.ProductNo}` + `\n` + `${LstStr}` +
      `市场价：¥${goodDetail.MarketPrice}  锦鲤最低价：¥${goodDetail.SalePrice}`
      wx.setClipboardData({
        data: shareMsg,
      })
    },
    toShare() {
      this.setData({ isShow: !this.data.isShow },()=>{
        //用户第一次点开分析模态框，且未绘制canvas会触发该方法
        if(this.data.isShow && this.data.isFrist){ //第一次打开时加载数据
          this.setData({ isFrist: false });
          this.renderCanvas(this.data.goodDetail).then(res=>{
            this.setClipboardData()
          });
        }
      })
    },
    toLogin(){
      wx.navigateTo({
        url: '/pages/Login/Login',
      })
    },
    renderCanvas(val){
      return new Promise((resolve,reject)=>{
        let baseUrl = app.globalData.gob.config.baseUrl; //获取根域名
        let list = val.ProductImg.map((item, index) => {  //替换域名
          let ImgUrl = baseUrl + String(item.ImgUrl).substring(item.ImgUrl.indexOf('com/') + 4);
          item.ImgUrl = ImgUrl;
          return item
        })
        this.setData({ list, goodDetail: val }, () => { //将所有图片本地加载完成，并获取其虚拟路径
          Promise.all([...list.map((item) => { return this.getNetWorkImageInfo(item.ImgUrl) }), this.renderLocalImage()]) //获取需被渲染图片的虚拟路径
            .then((list) => {
              this.getQtCode(val.Id).then(path => { //获取商品二维码
                this.setData({ isLogin: true }); //获取商品二维码成功代表用户已登录
                this.getNetWorkImageInfo(path);
                Promise.all([this.loadType_1(list, path),
                this.loadType_2(list, path),
                list.length >= 5 ? this.loadType_3(list, path) : true]) //渲染canvas
                  .then(res => {
                    this.setData({ isRender: false });  //是否渲染成功
                    this.setData({ isFrist: false });  //是否第一次渲染成功 ,成功渲染后为false 
                    resolve(true);
                  })
              }).catch(() => {
                //获取失败表明用户尚未登录
                this.setData({ isLogin: false }); //渲染失败表面用户没有动力
                this.setData({ isFrist: true }); //重置为第一次未渲染状态
              })
            })
        });
      })
    },
    change(e){ //轮播改变触发改方法，更改Active
      this.setData({ active:e.detail.current });
    },
    getQtCode(id) { // 获取商品二维码 
      return new Promise((resolve,reject)=>{
        app.globalData.post('Product/GetProductQrImg', { productid: id }).then(res => {
          if (res.data.success == 200) {
            let baseUrl = app.globalData.gob.config.baseUrl;
            let productQr = res.data.data.productQr;
            productQr = baseUrl + String(productQr).substring(productQr.indexOf('cn/') + 3);
            resolve(this.getNetWorkImageInfo(productQr));
          } else {
            reject(false);
          }
        })
      })
    },
    setIndex(e){ //点击选择分享样式按钮触发该事件
      let index = e.currentTarget.dataset.index;
      this.setData({active:index});
    },
    setMark(ctx,top=708){
      let userInfo = wx.getStorageSync('userInfo');
      let name = userInfo ? userInfo.NickName : '锦鲤团';
      let MarkStr = `来自 ${name} 强烈推荐`;
      let MarkStrWidth = ctx.measureText(MarkStr).width;
      ctx.setFontSize(this.getPx(22));
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(this.getPx(25), this.getPx(top), this.getPx(71) + MarkStrWidth, this.getPx(56));
      ctx.setFillStyle('#ffffff');
      ctx.fillText(MarkStr, this.getPx(93), this.getPx(top+37));
      ctx.drawImage('./image/logo.png', this.getPx(46), this.getPx(top + 9), this.getPx(38), this.getPx(38));
    },
    setPrice(ctx, top = 1068,left=0){
      ctx.setTextAlign('left');
      ctx.setFillStyle('#333333');//文字颜色：默认黑色
      ctx.setFontSize(this.getPx(30));
      let canvasTitleArray = this.data.goodDetail.ProductTitle.split("");
      let firstTitle = ""; //第一行字
      let secondTitle = ""; //第二行字
      for (let i = 0; i < canvasTitleArray.length; i++) {
        let element = canvasTitleArray[i];
        let firstWidth = ctx.measureText(firstTitle).width;
        if (firstWidth > this.getPx(507)) {
          let secondWidth = ctx.measureText(secondTitle).width;
          //第二行字数超过，变为...
          if (secondWidth > this.getPx(507)) {
            secondTitle += "...";
            break;
          } else {
            secondTitle += element;
          }
        } else {
          firstTitle += element;
        }
      }
      //第一行文字
      let tTop = null;
      ctx.fillText(firstTitle, left+this.getPx(25), this.getPx(top), this.getPx(507))//绘制文本
      //第二行问题
      if (secondTitle){
        tTop = top + 40;
        ctx.fillText(secondTitle, left+this.getPx(25), this.getPx(tTop), this.getPx(507))//绘制文本
      }
      ctx.setFillStyle('#FF3333');//文字颜色：默认黑色
      // ctx.font = `normal ${this.getPx(22)}px PingFang-SC-Heavy`//设置字体大小，默认10
      ctx.setFontSize(this.getPx(22));
      ctx.fillText(`限时价:￥ `, left+this.getPx(25), this.getPx(tTop ? (tTop+65) : (tTop+65)), this.getPx(427));
      ctx.setFontSize(this.getPx(34)) 
      ctx.fillText(`${Number(this.data.goodDetail.SalePrice).toFixed(2)}`, left+this.getPx(115), this.getPx(tTop ? (tTop + 65) : (tTop + 65)), this.getPx(427))
      ctx.setFillStyle('#999999');//文字颜色：默认黑色
      ctx.setFontSize(this.getPx(18)); 
      let markePriceTips = `市场价: ￥ ${Number(this.data.goodDetail.MarketPrice).toFixed(2)}`;
      let markePriceTipsWidth = ctx.measureText(markePriceTips).width;
      ctx.fillText(markePriceTips, left+this.getPx(25), this.getPx(tTop ? (tTop + 105) : (tTop + 105)), this.getPx(427));
      
      ctx.setFillStyle('#999999');//文字颜色：默认黑色
      ctx.fillRect(left+this.getPx(25), this.getPx(tTop ? (tTop + 99) : (top + 99)), markePriceTipsWidth+this.getPx(3), this.getPx(2));//删除线

      ctx.setFontSize(this.getPx(24))
      ctx.fillText(`扫码立享惊喜价`, left+this.getPx(527), this.getPx(tTop ? (tTop + 115) : (tTop + 115)), this.getPx(427));
      
    },
    getPx(rpx){
      return rpx / 750 * wx.getSystemInfoSync().windowWidth;
    },
    wxGetImageInfo(src){
      return new Promise((resolve,reject)=>{
        wx.getImageInfo({
          src: src,
          success:function(res){
            resolve(res);
          }
        })
      })
    },
    hide(){
      this.setData({isShow:false})
    },
    left(){
      let active = this.data.active-1;
      this.setData({ active})
    },
    right(){
      let active = this.data.active + 1;
      this.setData({ active })
    },
    PromiseSaveImageToPhotosAlbum(path){
      return new Promise((resolve,reject)=>{
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: function (data) {
            resolve(true);
            app.globalData.toast("保存图片成功！快去分享到朋友圈吧！")
          }
        })
      })
    },
    saveCanvas(){
      let index = Number(this.data.active) + 1;
      if (index == 3){
        Promise.all(this.data.allTypeImgPathList.map(item=>{
          return this.PromiseSaveImageToPhotosAlbum(item)
        })).then(res => {
          app.globalData.toast("保存图片成功！快去分享到朋友圈吧！")
        })
      }else{
        wx.canvasToTempFilePath({
          fileType: 'png',
          canvasId: `type_${index}`,
          success: (res) => {
            this.PromiseSaveImageToPhotosAlbum(res.tempFilePath).then(res=>{
              app.globalData.toast("保存图片成功！快去分享到朋友圈吧！")
            })
          }, fail(res) {
          }
        }, this)
      }
    },
    getNetWorkImageInfo(remote_url){
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: remote_url,
          success: res => {
            resolve(res.path)
          }
        });
      })
    },
    loadType_1(list,QrCode){
      let _this = this;
      return new Promise((resolve,reject)=>{
       
          let [frist, ...OrtherList] = list;
          OrtherList = OrtherList.length < 4 ? list : OrtherList;
          let ctx = wx.createCanvasContext('type_1', this);
          ctx.fillStyle = 'rgba(230, 46, 37, 1)';
          ctx.fillRect(this.getPx(0), this.getPx(0), this.getPx(750), this.getPx(1334));
          // 头部大图模块
          ctx.fillStyle = 'rgba(255, 255, 255, 1)';
          ctx.fillRect(this.getPx(23), this.getPx(118), this.getPx(700), this.getPx(1158));
        
          ctx.drawImage(this.data.bg_1_Url, 0, 0, this.getPx(750), this.getPx(608));
          ctx.drawImage(list[0], this.getPx(25), this.getPx(119), this.getPx(700), this.getPx(700));
          ctx.drawImage('./image/tj.png', this.getPx(627), this.getPx(139), this.getPx(78), this.getPx(84));
          //横列图片模块
  
          ctx.fillStyle = '#ffffff';
          ctx.shadowOffsetX = this.getPx(0); // 阴影X轴偏移
          ctx.shadowOffsetY = this.getPx(4); // 阴影Y轴偏移
          ctx.shadowBlur = this.getPx(9); // 模糊尺寸
          ctx.shadowColor = 'rgba(0, 0, 0, 0.08)'; // 颜色
          ctx.fillRect(this.getPx(25), this.getPx(819), this.getPx(700), this.getPx(190));
          ctx.shadowColor = 'rgba(0, 0, 0, 0)'; // 绘制容器后重置为透明

          let length = OrtherList.length > 4 ? 4 : OrtherList.length;
          for (let i = 0; i < length; i++) {
            let x = i ? this.getPx(25 + 15 + (i * (10 + 160))) : this.getPx(25 + 15)
            ctx.drawImage(OrtherList[i], x, this.getPx(834), this.getPx(160), this.getPx(160));
          }
          ctx.drawImage('./image/line.png', this.getPx(24), this.getPx(1253), this.getPx(701), this.getPx(8));
          ctx.drawImage(QrCode, this.getPx(550), this.getPx(608 + 420), this.getPx(160), this.getPx(160));
          ctx.drawImage('./image/tips.png', this.getPx(30), this.getPx(1289), this.getPx(690), this.getPx(24));
          //设置推荐Mark
          this.setPrice(ctx, 1068, 10);
          this.setMark(ctx,708);
          ctx.draw(true, () => {
            wx.canvasToTempFilePath({
              fileType: 'png',
              canvasId: 'type_1',
              success: (res) => {
                resolve(res.tempFilePath)
                _this.setData({ path_1: res.tempFilePath })
              }, fail(res) {
              }
            }, this)
          });

        }) 

   
    },
    loadType_2(list, QrCode) {
      let _this = this;
      return new Promise((resolve, reject) => {

        let [frist, ...OrtherList] = list;
        let ctx = wx.createCanvasContext('type_2', this);
        ctx.fillStyle = 'rgba(230, 46, 37, 1)';
        ctx.fillRect(this.getPx(0), this.getPx(0), this.getPx(750), this.getPx(1334));
        // 头部大图模块
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillRect(this.getPx(23), this.getPx(203), this.getPx(700), this.getPx(1033));

        ctx.drawImage(this.data.bg_3_url, 0, 0, this.getPx(750), this.getPx(608));
        ctx.drawImage(list[0], this.getPx(25), this.getPx(274), this.getPx(700), this.getPx(700));
        ctx.drawImage('./image/tj.png', this.getPx(627), this.getPx(297), this.getPx(78), this.getPx(84));
        //横列图片模块
        ctx.drawImage('./image/line.png', this.getPx(24), this.getPx(1253), this.getPx(701), this.getPx(8));
        ctx.drawImage(QrCode, this.getPx(550), this.getPx(608 + 420), this.getPx(160), this.getPx(160));
        ctx.drawImage('./image/tips.png', this.getPx(30), this.getPx(1284), this.getPx(690), this.getPx(24));
        //设置推荐Mark
        this.setPrice(ctx, 1068,10);
        this.setMark(ctx, 270+608);
        this.drawCtx(ctx, 'type_2').then(path => { 
          resolve(path);
          this.setData({ path_2: path })
        });

      })


    },
    loadType_3(list, QrCode) {
      let _this = this;
      return new Promise((resolve, reject) => {

        let userInfo = wx.getStorageSync('userInfo');
        let ctx = wx.createCanvasContext('type_3', this);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.getPx(0), this.getPx(0), this.getPx(2375), this.getPx(1782.5));
        this.drawItem(ctx, list[0], 0, 0, userInfo);
        this.drawItem(ctx, list[1], 0, this.getPx(750+62.5), userInfo);
        this.drawItem(ctx, list[2], 0, this.getPx(750 + 62.5 + 750 + 62.5), userInfo);
        this.drawItem(ctx, list[3], this.getPx(860 + 62.5), 0, userInfo);
        this.drawItem(ctx, list[4], this.getPx(860 + 62.5), this.getPx(750 + 62.5), userInfo);
        let baseTop = 750 + 62.5 + 750 + 62.5;
        let baseLeft = 860 + 62.5;
        this.drawLastItem(ctx, baseTop, baseLeft, list, QrCode);
        this.drawCtx(ctx, 'type_3').then(path =>{
          resolve(path);
          this.setData({ path_3: path })
        });

        let allTypeImgPathList = [];
        this.renderAllList(list[0], userInfo).then(path=>{
          allTypeImgPathList.push(path);
          this.renderAllList(list[1], userInfo).then(path => {
            allTypeImgPathList.push(path);
            this.renderAllList(list[2], userInfo).then(path => {
              allTypeImgPathList.push(path);
              this.renderAllList(list[3], userInfo).then(path => {
                allTypeImgPathList.push(path);
                this.renderAllList(list[4], userInfo).then(path => {
                  allTypeImgPathList.push(path);
                  {
                    let ctx = wx.createCanvasContext('type_5', this);
                    this.drawLastItem(ctx, 0, 0, list, QrCode);
                    this.drawCtx(ctx, 'type_5').then(path_2 => {
                      this.setData({path_4:path_2})
                      allTypeImgPathList.push(path_2);
                      this.setData({ allTypeImgPathList })
                    });
                  }
                })
              })
            })
          })
        })
      })
    },

    renderAllList(path, userInfo){
      return new Promise((resolve,reject)=>{
        let ctx = wx.createCanvasContext('type_4', this);
        this.drawItem(ctx, path, 0, 0, userInfo);
        this.drawCtx(ctx, 'type_4').then(path => {
          resolve(path);
        });
      })
    },
    drawCtx(ctx,TargetName){
      let _this = this;
      return new Promise((resolve,reject)=>{
        ctx.draw(true, () => {
          wx.canvasToTempFilePath({
            fileType: 'png',
            canvasId: TargetName,
            success: (res) => {
              resolve(res.tempFilePath)
            }
          }, this)
        });
      })
    },
    drawLastItem(ctx, baseTop, baseLeft, list, QrCode){
      let _this = this;
      function drawLastItem(ctx, list, top, left, userInfo, QrCode) {
        function drawRoundRectPath(cxt, width, height, radius) {
          cxt.beginPath(0);
          cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);//从右下角顺时针绘制，弧度从0到1/2PI    
          cxt.lineTo(radius, height);//矩形下边线  
          cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);//左下角圆弧，弧度从1/2PI到PI  
          cxt.lineTo(0, radius); 
          cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);//矩形左边线 
          cxt.lineTo(width - radius, 0);//上边线 
          cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);//右上角圆弧    
          cxt.lineTo(width, height - radius);//右边线  
          cxt.closePath();
        }
        function fillRoundRect(cxt, x, y, width, height, radius, fillColor) {
          if (2 * radius > width || 2 * radius > height) { return false; }//圆的直径必然要小于矩形的宽高   
          cxt.save();
          cxt.translate(x, y);//绘制圆角矩形的各个边  
          drawRoundRectPath(cxt, width, height, radius);
          cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
          cxt.fill();
          cxt.restore();
        }
        ctx.drawImage(_this.data.bg_2_url, left, top, _this.getPx(750), _this.getPx(478));
        fillRoundRect(ctx, left + _this.getPx(25), top + _this.getPx(144), _this.getPx(700), _this.getPx(340), _this.getPx(20), '#ffffff');
      }
      function setImage(path, top, left, tTop, tLeft) {
        let _top = baseTop + top;
        let _left = baseLeft + left;
        let _tTop = baseTop + tTop;
        let _tLeft = baseLeft + tLeft;
        ctx.drawImage(path, _this.getPx(_top), _this.getPx(_left), _this.getPx(160), _this.getPx(160))
        ctx.drawImage('./image/tj.png', _this.getPx(_tTop), _this.getPx(_tLeft), _this.getPx(26), _this.getPx(28))
      }
      ctx.fillStyle = 'rgba(231, 51, 42, 1)';
      ctx.fillRect(this.getPx(baseTop), this.getPx(baseLeft), this.getPx(750), this.getPx(860));

      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillRect(this.getPx(baseTop + 25), this.getPx(baseLeft + 102), this.getPx(700), this.getPx(659));

      drawLastItem(ctx, list, this.getPx(baseLeft), this.getPx(baseTop), QrCode);


      this.setPrice(ctx, baseLeft + 144 + 370 + 46, this.getPx(baseTop)+10);
      setImage(list[1], 380, 164, 500, 178);
      setImage(list[2], 550, 164, 670, 178);
      setImage(list[3], 380, 340, 500, 348);
      setImage(list[4], 550, 334, 670, 348);
      ctx.drawImage(list[0], this.getPx(baseTop + 40), this.getPx(baseLeft + 164), _this.getPx(330), _this.getPx(330));
      ctx.drawImage('./image/tj.png', this.getPx(baseTop + 310), this.getPx(baseLeft + 178), _this.getPx(46), _this.getPx(50));
      ctx.drawImage(QrCode, this.getPx(baseTop + 555), this.getPx(baseLeft + 531), this.getPx(160), this.getPx(160));
      ctx.drawImage('./image/line.png', this.getPx(baseTop + 24), this.getPx(baseLeft + 266 + 370 + 144), this.getPx(701), this.getPx(8));
      ctx.drawImage('./image/tips.png', this.getPx(baseTop + 31), this.getPx(baseLeft + 266 + 370 + 144 + 23), this.getPx(690), this.getPx(24));

      
    },
    drawItem(ctx, path, top, left, userInfo) {
      let _this = this;
      ctx.drawImage(path, left, top, _this.getPx(750), _this.getPx(750));
      var grad = ctx.createLinearGradient(0, 0, 300, 0); //创建一个渐变色线性对象
      grad.addColorStop(0, "rgba(229,41,32,1)");                  //定义渐变色颜色
      grad.addColorStop(1, "rgba(237,69,60,1)");
      ctx.fillStyle = grad;                         //设置fillStyle为当前的渐变对象
      ctx.fillRect(left, top + _this.getPx(750), _this.getPx(750), _this.getPx(110));
      ctx.drawImage('./image/logo.png', left + _this.getPx(40), top + _this.getPx(750 + 25), _this.getPx(60), _this.getPx(60));
      ctx.drawImage('./image/tj.png', left + _this.getPx(642), top + _this.getPx(30), _this.getPx(78), _this.getPx(84));
      let name = userInfo ? userInfo.NickName : '锦鲤团';
      let MarkStr = `来自 ${name} 强烈推荐`;
      ctx.setFillStyle('#ffffff');
      ctx.setFontSize(_this.getPx(30))
      ctx.fillText(MarkStr, left + _this.getPx(131), top + _this.getPx(65 + 750), 300);
    }
  }
})
