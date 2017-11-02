function share(obj){
	if(!obj.title){
		obj.title = "妈妈爱果";
	}
	
	if(!obj.desc){
		obj.desc = "中国首款共享农产品和农场采摘电商平台‘妈妈爱果’，数万用户收益，我也关注了妈妈爱果，邀请您一起来关注！";
	}
	
	if(!obj.link){
		obj.link = "http://ws.tianmaoetong.com/wx/Index?path=/home/";
	}else{
		obj.link = "http://ws.tianmaoetong.com/wx/Index?path=" + obj.link;
	}
	
	if(!obj.imgUrl){
		obj.imgUrl = 'http://ws.tianmaoetong.com/img/headImg/96798069714661273.png';
	}
	
	if(!obj.hide){
		obj.hide = ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"];
	}
	
	wx.ready(function(){
		wx.onMenuShareAppMessage({
		    title: obj.title, // 分享标题
		    desc: obj.desc, // 分享描述
		    link: obj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: obj.imgUrl, // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () {
		        // 用户确认分享后执行的回调函数
	        
		    },
		    cancel: function () {
		        // 用户取消分享后执行的回调函数
		    }
		});
		wx.onMenuShareTimeline({
		    title: obj.title, // 分享标题
		    link: obj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: obj.imgUrl, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    }
		});
		
		wx.hideMenuItems({
		  menuList: obj.hide
		});
	})
}

export default share;
