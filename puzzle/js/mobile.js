var img_list = [
                "img/logo.jpg",

                ];
var 
support = (window.Modernizr && Modernizr.touch === true) || (function () {
  return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
})(),
eventName = {
  start: support ? 'touchstart' : 'mousedown',
  move: support ? 'touchmove' : 'mousemove',
  end: support ? 'touchend' : 'mouseup',
  tap: support ? 'tap' : 'click'
};


$.fn.swipeHandle = function( handle ){
  if( this.length == 0){
    return;
  }
  var self = this;
  var data = {};
  self.on(eventName.start, handleEvent);

  function handleEvent (e){
    switch(e.type){
      case 'touchstart':
      case 'mousedown':
        start(e);
        break;
      case 'touchmove':
      case 'mousemove':
        move(e);
        break;
      case 'touchend':
      case 'mouseup':
        end(e);
        break;
    }
  }
  function start(e){
    var touches = support ? e.touches[0] : e;
  
    data = {
      startX: touches.pageX,
      startY: touches.pageY,
      distX: 0, // 移动距离
      distY: 0,
      time: +new Date
    }
    
    //绑定this后默认调用this.handleEvent
    self.on( eventName.move, move );
    self.on( eventName.end, end );
  }
  function move (e){
    var touches = support ? e.touches[0] : e;

    data.distX = touches.pageX - data.startX;
    data.distY = touches.pageY - data.startY;
    
    e.preventDefault();
  }
  function end (e){
    triggerEvent();
    self.off( eventName.move, move  );
    self.off( eventName.end, end  );
  }

  function triggerEvent (){
    duration = +new Date - data.time
    //触发事件

    if( Math.abs(data.distX) > Math.abs(data.distY) ){
      if(data.distX < -60){
        handle("left");
      }else if(data.distX > 60){
        handle("right");
      }
    }else{
      if(data.distY < -60){
        handle("up");
      }else if(data.distY > 60){
        handle("down");
      }
    }
  }
}


$(document).ready(function() {
  var game = new puzzle({
    container: $("#puzzle"),
    spaceBetween: 10
  })
  $(".list .item").on(eventName.tap, function(){
    if( $(this).hasClass('selected') ){
      return;
    }else{
      $(this).addClass("selected").siblings().removeClass("selected");
      var bg = $(this).attr("bg");
      var pz = $(this).attr("puzzle");

      $(".bg").css("background-image","url("+bg+")");
      game.change(pz);
    }
  })
  $(".list .item").eq( getRandom(0,4) ).trigger(eventName.tap);

  document.addEventListener(eventName.move, function(e){
    e.preventDefault();
  })
})

//随机数
function getRandom(a , b , toFixNum){
  if(a>b){
    a= [b, b=a][0];
  }
  if(!toFixNum){
    var rand = Math.round(Math.random()*(b-a)*1000);
    return rand % (b-a+1) + a;
  }else{
    var n = Math.random()*(b-a)+a;
    return Number(n.toFixed(toFixNum));
  }
}

function randomSort(arr){
  return arr.sort(function(){
          return Math.random()>0.5?-1:1;
        });
}

function puzzle(param){
  this.isAddEvent = false;
  this.isMoving = false;
  this.isRight = false;                         //是否已经还原
  this.container = param.container;             //容器
  this.spaceBetween = param.spaceBetween;       //图块间隔
  this.size = 9;                                //图块数量
  this.sizex = this.sizey = Math.sqrt(this.size);
  this.width = this.container.width();
  this.height = this.container.height();
  this.duration = typeof param.duration != "undefined" ? param.duration : 100;
  this.itemWidth = (this.width - (this.sizex-1) * this.spaceBetween)/3;
  this.itemHeight = (this.height - (this.sizey-1) * this.spaceBetween)/3;
  this.ease = "ease-out";                          //图块缓动方式
  this.data = {};
  this.stepCount = 0;
  if(typeof param.src != "undefined"){
    this.src = param.src;                         //图片路径
    var self = this;
    var img = new Image();
    img.onload = function(){
      self.init();
    }
    img.src = this.src;
  }
}
puzzle.prototype = {
  change: function(src){
    this.isMoving = false;
    this.isRight = false;

    this.src = src;
    var self = this;
    var img = new Image();
    img.onload = function(){
      self.init();
    }
    img.src = this.src;
  },
  init: function(){
    this.container.html("");
    this.stepCount = 0;

    //记录拼图数据
    var arr = [];
    for(var i = 1; i <= this.size; i++){
      arr.push(i);
    }
    var initData = randomSort(randomSort(arr));
    /*initData = [1, 2, 3, 4, 9, 5, 6, 7, 8];*/
    while( !this.hasSolution(initData) ){
      initData = randomSort(randomSort(arr));
    }
    console.log(initData);
    this.data.board = [[]];
    for(var y = 1; y <= this.sizey; y++){
      this.data.board.push([null]);
      for(var x = 1; x <= this.sizex; x++){
        var index = (y-1)*this.sizex+x-1;
        var p = initData[index];
        if(p == this.size){
          this.data.board[y][x] = null;     //最后一块留空
          this.data.nowx = x;
          this.data.nowy = y;
        }else{
          this.data.board[y][x] = new puzzleItem({
            container: this.container,
            src: this.src,
            duration: this.duration,
            originx: p%this.sizex == 0 ? this.sizex : p%this.sizex,
            originy: Math.ceil( p/this.sizex ),
            nowx: x,
            nowy: y,
            width: this.itemWidth,
            height: this.itemHeight,
            spaceBetween: this.spaceBetween,
            ease: this.ease
          })
        }
      }
    }

    if(!this.isAddEvent){
      this.isAddEvent = true;
      var self = this;
      this.container.swipeHandle( function(type){
        self.handleEvent(type);
      });
      document.onkeydown=function(event){
        var e = event;
        if(!e) return;

        if(e.keyCode==37){
          self.handleEvent("left");
        }else if(e.keyCode==38){
          self.handleEvent("up");
        }else if(e.keyCode==39){
          self.handleEvent("right");
        }else if(e.keyCode==40){
          self.handleEvent("down");
        }
      }
    }
  },
  handleEvent: function(type){
    if( this.isMoving || this.isRight) {
      return;
    }
    switch(type){
      case "left":
        if( this.data.nowx < 3){
          this.move( this.data.nowx+1, this.data.nowy);
        }
        break;
      case "right":
        if( this.data.nowx > 1){
          this.move( this.data.nowx-1, this.data.nowy);
        }
        break;
      case "up":
        if( this.data.nowy < 3){
          this.move( this.data.nowx, this.data.nowy+1);
        }
        break;
      case "down":
        if( this.data.nowy > 1){
          this.move( this.data.nowx, this.data.nowy-1);
        }
        break;
      default: 
        break;
    }
  },
  move: function(sourcex, sourcey){
    this.isMoving = true;
    this.stepCount ++;
    var self = this;
    this.data.sourcex = sourcex;
    this.data.sourcey = sourcey;
    this.data.board[sourcey][sourcex].moveTo( this.data.nowx, this.data.nowy, this.moveEnd, self);
  },
  moveEnd: function(){
    this.data.board[this.data.nowy][this.data.nowx] = this.data.board[this.data.sourcey][this.data.sourcex];
    this.data.board[this.data.sourcey][this.data.sourcex] = null;
    this.data.nowx = this.data.sourcex;
    this.data.nowy = this.data.sourcey;
    this.isMoving = false;
    this.check();
  },
  check: function(){
    var isRight = true;
    for(var y = 1; y <= this.sizey; y++){
      for(var x = 1; x <= this.sizex; x++){
        if(this.data.board[y][x] != null && !this.data.board[y][x].isRightPos()){
          isRight = false;
          break;
        }
      }
      if(!isRight){ break; }
    }
    if( isRight ){
      this.isRight = true;
      alert("搞定! 步数："+this.stepCount);
    }
  },

  /*
  判断是否有解
  原理为：假如初始值为[3, 4, 2, 1, 7, 6, 9, 5, 8]
  去除9 得到 arr = [3, 4, 2, 1, 7, 6, 5, 8]
  再计算该序列的逆序数
  遍历所有arr[i]，计算y = f(i), y为arr[i]后面的数(arr[i+])小于arr[i]的个数
  再求和返回 s = sum(f(i))
  如果s为偶数则有解，为奇数则无解
  */
  hasSolution: function(initData){
    var tmp = [];
    for(var i in initData){
      if(initData[i] != this.size){
        tmp.push(initData[i]);
      }
    }
    var count = 0;
    for(var i = 0; i < tmp.length-1; i++){
      for(var j = i+1; j < tmp.length; j++){
        if(tmp[i] > tmp[j]){
          count++;
        }
      }
    }
    return count%2 == 0 ? true : false;
  }
}


function puzzleItem(param){
  this.container = param.container;
  this.src = param.src;
  this.duration = param.duration;
  this.originx = param.originx;
  this.originy = param.originy;
  this.nowx = param.nowx;
  this.nowy = param.nowy;
  this.width = param.width;
  this.height = param.height;
  this.spaceBetween = param.spaceBetween;       //图块间隔
  this.imgOffsetx = -(this.originx - 1)*(this.width + this.spaceBetween);
  this.imgOffsety = -(this.originy - 1)*(this.height + this.spaceBetween);
  this.object = $(document.createElement("div"));
  this.object.attr({
    "id": "origin-"+this.originx+"-"+this.originy,
  })
  this.object.addClass("puzzleItem");
  this.object.css({
    "width": this.width+"px",
    "height": this.height+"px",
    "background-image": "url("+this.src+")",
    "background-size": this.container.width()+"px "+this.container.height()+"px",
    "background-position": this.imgOffsetx+"px "+this.imgOffsety+"px",
            "transform": "translate("+ ((this.nowx - 1)*(this.width + this.spaceBetween)) +"px,"+((this.nowy - 1)*(this.height + this.spaceBetween))+"px)",
    "-webkit-transform": "translate("+ ((this.nowx - 1)*(this.width + this.spaceBetween)) +"px,"+((this.nowy - 1)*(this.height + this.spaceBetween))+"px)"
  })

  this.init();
}

puzzleItem.prototype = {
  init: function(){
    this.container.append(this.object);
  },
  moveTo: function(x , y , callback, instance){
    var self = this;
    this.setNowPos(x, y);
    this.object.animate({
              "transform": "translate("+ ((this.nowx - 1)*(this.width + this.spaceBetween)) +"px,"+((this.nowy - 1)*(this.height + this.spaceBetween))+"px)",
      "-webkit-transform": "translate("+ ((this.nowx - 1)*(this.width + this.spaceBetween)) +"px,"+((this.nowy - 1)*(this.height + this.spaceBetween))+"px)"
    },this.duration, this.ease, function(){
      callback.call(instance);
    })
  },
  setNowPos: function(x ,y){
    this.nowx = x;
    this.nowy = y;
  },
  isRightPos: function(){
    return this.originx == this.nowx && this.originy == this.nowy;
  },
}