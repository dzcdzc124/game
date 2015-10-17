

var support = (window.Modernizr && Modernizr.touch === true) || (function () {
  return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
})();
var eventName = {
  start: support ? 'touchstart' : 'mousedown',
  move: support ? 'touchmove' : 'mousemove',
  end: support ? 'touchend' : 'mouseup',
  tap: support ? 'tap' : 'click'
};

var winwidth = 0;
var winheight = 0;
var mygroup = new Array();
var now_issue = 0;
var totalcount = {input:0,output:0,offtax:0};
var awardconfig = {
		"1":5000000,
		"2":150000,
		"3":3000,
		"4":200,
		"5":10,
		"6":5,
};
var thiscount = {
		input:0,
		output:0,
		offtax:0,
		awardcount:{
			"1":0,
			"2":0,
			"3":0,
			"4":0,
			"5":0,
			"6":0,
		},
};


var pageControl = (function () {
  	var words = [
	             "别走开，不定什么时候爆个五百万",
	             "悄悄告诉你，你有好几次跟大奖擦肩而过",                  
			],
    statObj = null,       //统计组件
    winwidth = 640,       //页面宽
    winheight = 960,     //页面高
    designWidth = 640,    //设计宽
    designHeight = 960,  //设计高
    winscale = 1;         //页面缩放

  return {
    init: function(){
      var winsize = getWinSize();
      winwidth = winsize.width;
      winheight = winsize.height;
      if(IsPC()){
        /*$(".main").css({
          '-webkit-transform': "scale("+0.8+")",
          'transform': "scale("+0.8+")"
        });*/
      }else{
        $("body").width(winwidth).height(winheight);
      }
      if(winwidth/winheight > designWidth/designHeight){
        winscale = winheight / designHeight;
      }else{
        winscale = winwidth / designWidth;
      }
      $(".main").width(winwidth).height(winheight);

      if($(".winscale").length > 0){
        $(".winscale").css({
          '-webkit-transform': "scale("+winscale+")",
          'transform': "scale("+winscale+")"
        });
      }

      
    statSave: function(action,type){
      if(typeof _hmt != "undefined"){
          _hmt.push(['_trackEvent', action, type]);
      }
      if(typeof _czc != "undefined"){
          _czc.push(["_trackEvent", action, type]);
      }
    }
  }
}());

$(document).ready(function() {
	pageinit();
	
	//选择号码
	$(".red-ball li,.blue-ball li").on(eventName.tap,function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		}else{
			$(this).addClass("active");
		}
		$("#random").val(0);
		count();
	}).on("touchstart",function(){
		$(this).addClass("on");
	}).on("touchend",function(){
		$(this).removeClass("on");
	})
	
	$("#follow,#random").on("change",function(){
		count();
	})
	
	
	//随机一注
	$(".selection1").on(eventName.tap,function(){
		mygroup = get_random(1);
		$("#random").val(0);
		$(".red-ball li,.blue-ball li").removeClass("active");
		if( mygroup.length > 0){
			for(var i in mygroup[0].red){
				$(".red-ball li").eq( mygroup[0].red[i] - 1 ).addClass("active");
			}
			for(var i in mygroup[0].blue){
				$(".blue-ball li").eq( mygroup[0].blue[i] - 1 ).addClass("active");
			}
		}
		count();
	}).on("touchstart",function(){
		$(this).addClass("on");
	}).on("touchend",function(){
		$(this).removeClass("on");
	})
	
	//规则
	$(".gorule").on(eventName.tap,function(){
		$(".page2,.tle2,.bottom2").animate({"-webkit-transform":"translateX(0px)"},200);
	})
	$(".page2").swipeRight(function(){
		$(".page2,.tle2,.bottom2").animate({"-webkit-transform":"translateX("+winwidth+"px)"},200);
	})
	$(".bottom2 .goback").on(eventName.tap,function(){
		$(".page2,.tle2,.bottom2").animate({"-webkit-transform":"translateX("+winwidth+"px)"},200);
	})
	//结果
	$(".page3").swipeRight(function(){
		if($(".bottom3 .goback").hasClass("on")){
			$(".page3,.tle3,.bottom3").animate({"-webkit-transform":"translateX("+winwidth+"px)"},200);
		}
	})
	$(".bottom3 .goback").on(eventName.tap,function(){
		if($(".bottom3 .goback").hasClass("on")){
			$(".page3,.tle3,.bottom3").animate({"-webkit-transform":"translateX("+winwidth+"px)"},200);
		}
	})
	//清除选择
	$(".clear").on(eventName.tap,function(){
		$("#random").val(0);
		$("#follow").val(1);
		$(".red-ball li,.blue-ball li").removeClass("active");
		count();
	})	
	
	$(".bottom .commit").on(eventName.tap,function(){
		if($(this).hasClass("on")){
			lottery_run();
		}
	});
})

function pageinit(){
	winwidth = $(window).width();
	winheight = $(window).height();
	
	var rem = winwidth / 32;
	rem = rem.toFixed(1);
	$("html").css("font-size",rem+"px");
	$(".lottery").width(winwidth).height(winheight);
	$(".page2 , .page3 ,.tle2,.tle3,.bottom2,.bottom3").css({"-webkit-transform":"translateX("+winwidth+"px)"});

	pageLoading("hide");
	
	
	
	
}


//------计算投注情况------//
function count(){
	var num = 0; 	//单期注数
	var fnum = 0;	//追号期数
	var total = 0;	//总注数
	var random = $("#random").val();
	mygroup = new Array();		//重置我的组合
	if(random == 0){
		$("#random").val(0);
		var red_num = 0;
		var blue_num = 0;
		var list = {"red":[],"blue":[]};
		$(".red-ball li").each(function(){
			if($(this).hasClass("active")){
				red_num ++;
				list["red"].push(parseInt($(this).attr("value")));
			}
		})
		
		$(".blue-ball li").each(function(){
			if($(this).hasClass("active")){
				blue_num ++;
				list["blue"].push(parseInt($(this).attr("value")));
			}
		})
		
		if(red_num >= 6 && blue_num >= 1){
			var red_concat_num = c(red_num,6);
			num = red_concat_num * blue_num ;
			
			mygroup.push(list);
		}
	}else{
		num = random;
		$(".red-ball li,.blue-ball li").removeClass("active");
	}
	
	if(num > 0){
		fnum = $("#follow").val();
		total = num * fnum;
		$(".count .s1").html("共"+total+"注");
		$(".count .s2").html("<span>"+(total*2)+"</span>元");
		$(".commit").addClass("on");
	}else{
		$(".count .s1").html("共0注");
		$(".count .s2").html("0元");
		$(".commit").removeClass("on");
	}
}

/* 
 * 根据用户选定的方式开奖
 * */
function lottery_run(){
	var num = 0; 	//单期注数
	var fnum = 0;	//追号期数
	var random = parseInt($("#random").val());
	fnum = parseInt($("#follow").val());
	
	var record = false;
	if(random == 0){
		if(mygroup.length > 0){
			record = {
					"now_num"	: 0,
					"num"		: 1,
					"now_fnum"	: 0,
					"fnum"		: fnum,
					"win_nums"	: {},
			};
		}else{
			alert("请选择至少一组号码")
		}
	}else{
		num = random;
		mygroup = get_random(num);
		
		record = {
				"now_num"	: 0,
				"num"		: num,
				"now_fnum"	: 0,
				"fnum"		: fnum,
				"win_nums"	: {},
		};
	}
	
	if(record){
		$(".page3,.tle3,.bottom3").animate({"-webkit-transform":"translateX(0px)"},200);
		$(".bottom3 .goback").removeClass("on");
		thiscount = {input:0,output:0,offtax:0,awardcount:{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,}};
		var thisinput = parseInt($(".count .s2 span").text());
		thiscount.input = thisinput;
		totalcount.input += thisinput;
		process(record);
	}
}


/* 开奖过程
 * 运行进度记录对象
 * record object {
 * 				now_num		: 当前运行注数 0~num-1
 * 				num			: 总注数
 * 				now_fnum	: 当前运行期数 0~fnum
 * 				fnum		: 追期数
 * 				win_nums	: 当前期开奖结果
 * }
 * 
 */
function process(record){
	if(typeof record != "object") return;
	
	var step = 100;
	var now_step = 0;
	var delay = 20;
	
	//运行至中途
	//console.log(record);
	if(record.now_num > 0 && !isEmptyObject(record.win_nums)){
		
		for(var j = record.now_num; j < mygroup.length; j++){
			compare(record.win_nums,mygroup[j]);
			now_step++;
			if(now_step >= step){
				record.now_num = j+1;
				setTimeout(process,delay,record);
				return;
			}
		}
		record.now_fnum ++;
		record.now_num = 0;
	}
	
	for(var i = record.now_fnum ;i < record.fnum ; i++ , record.now_fnum ++){
		now_issue ++;
		
		$(".page3 .running").html("<span>第"+ now_issue +"期</span>：开奖中....");
		
		var win_nums = get_random(1);
		win_nums = win_nums[0];
		record.win_nums = win_nums;
		
		for(var j in mygroup){
			compare(win_nums,mygroup[j]);
			now_step++;
			if(now_step >= step){
				record.now_num = parseInt(j) + 1;
				setTimeout(process,delay,record);
				return;
			}
		}
	}
	var thtml = "<p>本次投注结果</p>";
	if(thiscount.awardcount["1"] > 0){
		thtml += "<p>一等奖："+thiscount.awardcount["1"]+"注</p>";
	}
	if(thiscount.awardcount["2"] > 0){
		thtml += "<p>二等奖："+thiscount.awardcount["2"]+"注</p>";
	}
	if(thiscount.awardcount["3"] > 0){
		thtml += "<p>三等奖："+thiscount.awardcount["3"]+"注</p>";
	}
	if(thiscount.awardcount["4"] > 0){
		thtml += "<p>四等奖："+thiscount.awardcount["4"]+"注</p>";
	}
	if(thiscount.awardcount["5"] > 0){
		thtml += "<p>五等奖："+thiscount.awardcount["5"]+"注</p>";
	}
	if(thiscount.awardcount["6"] > 0){
		thtml += "<p>六等奖："+thiscount.awardcount["6"]+"注</p>";
	}
	
	thtml += "<p>投入："+thiscount.input+"</p>";
	thtml += "<p>彩金："+thiscount.output+"</p>";
	thtml += "<p>税后："+thiscount.offtax+"</p>";
	thtml += "<p>总计</p>";
	thtml += "<p>总投入："+totalcount.input+"</p>";
	thtml += "<p>总彩金："+totalcount.output+"</p>";
	thtml += "<p>总税后："+totalcount.offtax+"</p>";
	thtml += "<p></p>";
	$(".page3 .result .running").before(thtml);
	$('.page3').scrollTop($('.page3 .result').height());
	$(".page3 .running").html("开奖结束");
	$(".bottom3 .goback").addClass("on");
}


/*
 * 比较号码，获得中奖结果 
 */
function compare(win_nums,my_nums){
	var right_red = 0;
	var right_blue = 0;
	for(var r in win_nums.red){
		if(in_array( win_nums.red[r] , my_nums.red )){
			right_red ++ ;
		}
	}
	for(var b in win_nums.blue){
		if(in_array( win_nums.blue[b] , my_nums.blue )){
			right_blue ++ ;
		}
	}
	//console.log(ttt++);
	//console.log(win_nums);
	//console.log(my_nums);
	//计算奖金
	var awardlever = 0;			//奖级
	var awardcount = {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,};	//各奖级注数统计
	if( right_red == 6 && right_blue == 1 ){
		awardlever = 1;
	}else if( right_red == 6 && right_blue == 0 ){
		awardlever = 2; 
	}else if( right_red == 5 && right_blue == 1  ){
		awardlever = 3;
	}else if( (right_red == 5 && right_blue == 0) || (right_red == 4 && right_blue == 1) ){
		awardlever = 4;
	}else if( (right_red == 4 && right_blue == 0) || (right_red == 3 && right_blue == 1)  ){
		awardlever = 5;
	}else if( right_blue == 1 ){
		awardlever = 6;
	}
	
	if(awardlever > 0){
		//复式投注的计算
		if(my_nums.red.length > 6 || my_nums.blue.length > 1){
			var rnum = my_nums.red.length;
			var bnum = my_nums.blue.length;
			for(var lever = awardlever ; lever <= 6; lever ++){
				switch(lever){
				case 1:
					awardcount["1"] += 1;
					break;
				case 2:
					awardcount["2"] += c(right_red,6) * c(rnum-right_red,0) * c(right_blue,0) * c(bnum-right_blue,1);
					break;
				case 3:
					awardcount["3"] += c(right_red,5) * c(rnum-right_red,1) * c(right_blue,1) * c(bnum-right_blue,0);
					break;
				case 4:
					awardcount["4"] += c(right_red,5) * c(rnum-right_red,1) * c(right_blue,0) * c(bnum-right_blue,1);
					awardcount["4"] += c(right_red,4) * c(rnum-right_red,2) * c(right_blue,1) * c(bnum-right_blue,0);
					break;
				case 5:
					awardcount["5"] += c(right_red,4) * c(rnum-right_red,2) * c(right_blue,0) * c(bnum-right_blue,1);
					awardcount["5"] += c(right_red,3) * c(rnum-right_red,3) * c(right_blue,1) * c(bnum-right_blue,0);
					break;
				case 6:
					awardcount["6"] += c(right_red,2) * c(rnum-right_red,4) * c(right_blue,1) * c(bnum-right_blue,0);
					awardcount["6"] += c(right_red,1) * c(rnum-right_red,5) * c(right_blue,1) * c(bnum-right_blue,0);
					awardcount["6"] += c(right_red,0) * c(rnum-right_red,6) * c(right_blue,1) * c(bnum-right_blue,0);
					break;
				}
			}
			
		}else{
			awardcount[awardlever] += 1;
		}
		
		for(var name in awardcount){
			thiscount.awardcount[name] += awardcount[name];
			
			var output = Math.round(awardcount[name] * awardconfig[name]);
			var offtax = output;
			if(awardconfig[name] >= 10000){	//缴税
				offtax = offtax * 0.8;
			}
			thiscount.output += output;
			thiscount.offtax += offtax;
			totalcount.output += output;
			totalcount.offtax += offtax;
		}
	}
	
	
	
	write_log(awardcount,my_nums,win_nums);
	
}

//write_log
function write_log(awardcount,my_nums,win_nums){
	var thtml = "";
	if(my_nums.red.length > 6 || my_nums.blue.length > 1){
		if(awardcount["1"] > 0 || awardcount["2"] > 0 || awardcount["3"] > 0){
			thtml = "<p>第"+now_issue+"期：中</p>";
			if(awardcount["1"] > 0){
				thtml += "<p>一等奖："+awardcount["1"]+"注</p>";
			}
			if(awardcount["2"] > 0){
				thtml += "<p>二等奖："+awardcount["2"]+"注</p>";
			}
			if(awardcount["3"] > 0){
				thtml += "<p>三等奖："+awardcount["3"]+"注</p>";
			}
			if(awardcount["4"] > 0){
				thtml += "<p>四等奖："+awardcount["4"]+"注</p>";
			}
			if(awardcount["5"] > 0){
				thtml += "<p>五等奖："+awardcount["5"]+"注</p>";
			}
			if(awardcount["6"] > 0){
				thtml += "<p>六等奖："+awardcount["6"]+"注</p>";
			}
			thtml += "<p>开奖号码："+ win_nums.red.join(" ") + "|" + win_nums.blue.join(" ") +"</p>";
			thtml += "<p>投注号码："+ my_nums.red.join(" ") + "|" + my_nums.blue.join(" ") + "(复式)</p>";
		}
	}else{
		var award = "";
		if(awardcount["1"] > 0){
			award = "一等奖";
		}else if(awardcount["2"] > 0){
			award = "二等奖";
		}else if(awardcount["3"] > 0){
			award = "三等奖";
		}
		
		if(award != ""){
			thtml += "<p>第"+now_issue+"期：中"+award+"</p>";
			thtml += "<p>开奖号码："+ win_nums.red.join(" ") + "|" + win_nums.blue.join(" ") +"</p>";
			thtml += "<p>投注号码："+ my_nums.red.join(" ") + "|" + my_nums.blue.join(" ") + "(单式)</p>";
		}
	}
	
	$(".page3 .result .running").before(thtml);
	if(thtml != ""){
		$('.page3').scrollTop($('.page3 .result').height());
	}
}


/* 随机生成号码
 * num 生成号码组数
 * */
function get_random(num){
	var result = new Array();
	num = parseInt(num);
	if(num <= 0) num = 1;
	for(var i = 0; i < num ; i++){
		var list = {"red":[],"blue":[]};
		for(var r = 0 ;r < 6 ; r++){
			var ran = Math.ceil(Math.random()*33);
			while(in_array(ran,list["red"])){
				ran = Math.ceil(Math.random()*33);
			}
			list["red"].push(ran);
		}
		list["red"].sort(function(a,b){return a>b?1:-1});
		list["blue"].push(Math.ceil(Math.random()*16));
		result.push(list);
	}
	//console.log(result);
	return result;
}


function in_array(search,array){
    for(var i in array){
        if(array[i]==search){
            return true;
        }
    }
    return false;
}

//阶乘
function fact(num){
	if (num<=1){
		return 1;
	}else{
		return num*arguments.callee(num-1);
	}
}
//组合数
function c(n,m){
	if(n<m){
		return 0;
	}else if(n==m){
		return 1;
	}else if(m==0){
		return 1;
	}else{
		var result = fact(n)/( fact(m) * fact(n-m) );
		return Math.round( result );
	}
}

//是否空对象
function isEmptyObject(o){
	if(typeof o == "object"){
	    for(var n in o){
	        return false;
	    }
	}
    return true;
}

//---页面等待---//
function pageLoading(sw){
	if (sw == "show"){
		$(".fullmask,.pageloading").show();
	}
	if (sw == "hide"){
		$(".fullmask,.pageloading").hide();
	}
}


function getWinSize(){
  var winWidth = 0 , winHeight = 0;
  // 获取窗口宽度
  if (window.innerWidth)
  winWidth = window.innerWidth;
  else if ((document.body) && (document.body.clientWidth))
  winWidth = document.body.clientWidth;
  // 获取窗口高度
  if (window.innerHeight)
  winHeight = window.innerHeight;
  else if ((document.body) && (document.body.clientHeight))
  winHeight = document.body.clientHeight;
  // 通过深入 Document 内部对 body 进行检测，获取窗口大小
  if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
  {
  winHeight = document.documentElement.clientHeight;
  winWidth = document.documentElement.clientWidth;
  }
  
  return {width:winWidth,height:winHeight};
}

//判断终端类型
function IsPC()  {  
   var userAgentInfo = navigator.userAgent;  
   var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", "Nokia", "WebKit");  
   var flag = true;  
   for (var v = 0; v < Agents.length; v++) {  
       if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
   }  
   return flag;  
}