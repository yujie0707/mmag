<template>
	<div id="bargain">
		<div class="top">
			<img src="/dist/image/bargain/backgroundtop@2x.png" />
			<div class="rule" @click="showActivity()">
				活动说明
			</div>
		</div>
		<ul class="list">
			<li v-for="item in list" >
				<img v-lazy="item.proImg" class="img" />
				<div class="detail-wrap">
					<p>{{item.proName}}</p>
					<p>{{item.taxDetails}}</p>
					<p>原价：￥<span>{{item.price}}</span></p>
					<p v-if="item.status == 3" @click="goHelp(item.id)"><span>发起砍价</span></p>
					<p v-else-if="item.status == 1" @click="goHelp(item.id)"><span>砍价中...</span></p>
					<p v-else><span>已付款</span></p>
				</div>
			</li>
		</ul>
		<img src="/dist/image/bargain/bottom.png" class="bottom" />
		<div class="activity-wrap" v-if="show" :style="{height:height + 'px'}">
			<div class="detail">
				<h3>活动说明</h3>
				<div>
					<p>1.一个商品只可购买一次</p>
					<p>2.一个微信号首次可砍0.8~1.5元</p>
					<p>3.该活动不可与其他优惠活动同时使用（如优惠券)</p>
					<p>4.下单后去妈妈爱果微信公众号里的微商城查看订单</p>
					<p>5.活动截止到10月8号</p>
				</div>
				<button @click="hide()">我知道了</button>
			</div>
		</div>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import config from "../config/config.js";
	import Alert from "../alert.vue";
	export default{
		components:{
			"v-alert": Alert
		},
		data(){
			return {
				show:false,
				alertshow:false,
				context:"",
				height:0,
				list:[],
				end:false
			}
		},
		methods:{
			showActivity(){
				this.show = true;
			},
			hide(){
				this.show = false;
			},
			
			goHelp(id){
				if(this.end){
					this.alertshow = true;
					this.context = "活动结束";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				axios.post("/activity/PushCut",{
					catid:id
				},config).then(res => {
					if(res.data.code == 0){
						sessionStorage.setItem("shareid",res.data.data.shareid);
						this.$router.push("/help");
					}else{
						this.alertshow = true;
						this.context = "发起失败，请重新尝试";
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}
				})
			}
		},
		activated(){
			wx.ready(function(){
				wx.onMenuShareAppMessage({
				    title: '月满中秋砍价0元购', // 分享标题
				    desc: '妈妈爱果推出月满中秋砍价0元购活动，大家都来参与吧', // 分享描述
				    link: 'http://ws.tianmaoetong.com/wx/Index?path=/bargain', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				    imgUrl:"http://ws.tianmaoetong.com/dist/image/bargain/backgroundtop@2x.png", // 分享图标
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
				    title: '月满中秋砍价0元购',
				    link: 'http://ws.tianmaoetong.com/wx/Index?path=/bargain',
				    imgUrl:"http://ws.tianmaoetong.com/dist/image/bargain/backgroundtop@2x.png",
				    success: function () { 
				        
				    },
				    cancel: function () { 
				        
				    }
				});
				
				wx.hideMenuItems({
				  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] 
				});
			})
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			this.height = document.body.offsetHeight;
			
			axios.post("/activity/CutMoney",{},config).then(res => {
				if(res.data.code == 0){
					this.list = res.data.data;
				}else if(res.data.code == 432){
					this.list = res.data.data;
					this.end = true;
					this.alertshow = true;
					this.context = "活动结束";
					setTimeout(() => {
						this.alertshow = false;
					},2000);
				}
			})
		}
		
	}
</script>

<style>
</style>