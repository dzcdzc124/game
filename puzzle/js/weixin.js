var ua = navigator.userAgent.toLowerCase();
var WXversion = ua.match(/micromessenger/) ? ua.match(/micromessenger\/([\d.]+)/)[1] : null;


//自定义微信分享
window.shareData = {
	picUrl: basePath + "/img/400.jpg",
    url: baseLink,
	title: "真机原来这么美！畅快vivo X6开启全国热销。",
	desc: "4G大运存，急速指纹，双引擎闪充。官网购机即享六重好礼。",
    timelineTitle : "真机原来这么美！畅快vivo X6开启全国热销。配备4G大运存，购机即享六重大礼！",
	callback: function(type) {
        if(typeof _hmt != "undefined"){
            _hmt.push(['_trackEvent', "weixin", type]);
        }
        if(typeof _czc != "undefined"){
            _czc.push(["_trackEvent", "weixin", type]);
        }
	}
};
if(isExp){
    window.shareData.title = "小伙伴们都去品鉴X6了，就差你啦！";
    window.shareData.desc = "12月13日，你来品鉴高颜值X6，vivo来送手机大奖！";
    window.shareData.timelineTitle = "12月13日，全国100城X6粉丝品鉴会火爆召开，更有惊喜礼品等你来！";
}


function refreshShareData() {
    if (WXversion >= '6.0.2') {
        wx.ready(function(){
            wx.onMenuShareTimeline({
                title: window.shareData.timelineTitle,
                link: window.shareData.url,
                imgUrl: window.shareData.picUrl,
                success: function () { 
                    shareData.callback("ShareTimeline");
                },
                cancel: function () {}
            });

            wx.onMenuShareAppMessage({
                title: window.shareData.title,
                desc: window.shareData.desc,
                link: window.shareData.url,
                imgUrl: window.shareData.picUrl,
                type: '',
                dataUrl: '',
                success: function () { 
                    shareData.callback("ShareAppMessage");
                },
                cancel: function () {}
            });

            wx.onMenuShareQQ({
			    title: window.shareData.title,
			    desc: window.shareData.desc,
			    link: window.shareData.url,
			    imgUrl: window.shareData.picUrl,
			    success: function () { 
			       shareData.callback("ShareQQ");
			    },
			    cancel: function () { 
			       // 用户取消分享后执行的回调函数
			    }
			});
			wx.onMenuShareWeibo({
			    title: window.shareData.title,
			    desc: window.shareData.desc,
			    link: window.shareData.url,
			    imgUrl: window.shareData.picUrl,
			    success: function () { 
			       shareData.callback("ShareWeibo");
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			    }
			});
        });
    } else {
        (function() {
            function onBridgeReady() {
                WeixinJSBridge.call('hideToolbar');
                WeixinJSBridge.call('showOptionMenu');
                WeixinJSBridge.on('menu:share:timeline', function(argv){
                    WeixinJSBridge.invoke('shareTimeline',{
                        "img_url"    : window.shareData.picUrl,
                        "img_width"  : "400",
                        "img_height" : "400",
                        "link"       : window.shareData.url,
                        "desc"       : window.shareData.desc,
                        "title"      : window.shareData.title
                    }, function(res){
                        shareData.callback("ShareTimeline");
                    });
                });

                WeixinJSBridge.on('menu:share:appmessage', function(argv){
                    WeixinJSBridge.invoke('sendAppMessage',{
                        "appid"      : appId,
                        "img_url"    : window.shareData.picUrl,
                        "img_width"  : "400",
                        "img_height" : "400",
                        "link"       : window.shareData.url,
                        "desc"       : window.shareData.desc,
                        "title"      : window.shareData.title
                    }, function(res){
                        shareData.callback("ShareAppMessage");
                    });
                });

                WeixinJSBridge.on('menu:share:weibo', function(argv){
                    WeixinJSBridge.invoke('shareWeibo',{
                        "content" : window.shareData.desc + window.shareData.url,
                        "url"     : window.shareData.url
                    }, function(res){
                        shareData.callback("ShareWeibo");
                    });
                });

                WeixinJSBridge.on('menu:share:facebook', function(argv){
                    WeixinJSBridge.invoke('shareFB',{
                          "img_url"    : window.shareData.picUrl,
                          "img_width"  : "640",
                          "img_height" : "640",
                          "link"       : window.shareData.url,
                          "desc"       : window.shareData.desc,
                          "title"      : window.shareData.title
                    }, function(res) {
                        shareData.callback("ShareFacebook");
                    });
                });

                WeixinJSBridge.on('menu:general:share', function(argv){
                    argv.generalShare({
                        "appid"      : appId,
                        "img_url"    : window.shareData.picUrl,
                        "img_width"  : "640",
                        "img_height" : "640",
                        "link"       : window.shareData.url,
                        "desc"       : window.shareData.desc,
                        "title"      : window.shareData.title
                    }, function(res){
                        shareData.callback("generalShare");
                    });
                });
            };

            document.addEventListener('WeixinJSBridgeReady', onBridgeReady);
        })();
    }
}
refreshShareData();