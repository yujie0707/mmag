<template>
	<div id="bargain">
		<div class="top">
			<img src="/dist/image/bargain/backgroundtop@2x.png" />
			<img src="/dist/image/bargain/procedure@2x.png" />
			<div class="time">
				<a>{{day < 10 ? "0" + day : day}}</a>
				<span>天</span>
				<a>{{hour < 10 ? "0" + hour : hour}}</a>
				<span>时</span>
				<a>{{minute < 10 ? "0" + minute : minute}}</a>
				<span>分</span>
				<a>{{second < 10 ? "0" + second : second}}</a>
				<span>秒</span>
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
		<div class="rule">
			<h3>活动规则</h3>
			<p>1.一个商品只可购买一次</p>
			<p>2.该活动不可与其他优惠活动同时使用（如优惠券)</p>
			<p>3.下单后去妈妈爱果微信公众号微商城查看订单</p>
			<p>4.新用户首次可砍0.8-1.5元，老用户每次可砍0.2-0.5元</p>
			<p>5.该活动仅限青岛地区参与，其他地区敬请期待</p>
			<p>6.该活动商品，砍至任意价格均可付款</p>
			<p>7.参与活动的用户请于活动持续期间付款，逾期不能付款</p>
		</div>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import config from "../config/config.js";
	import Alert from "../alert.vue";
	import share from "../share/share.js";
	export default{
		components:{
			"v-alert": Alert
		},
		data(){
			return {
				alertshow:false,
				context:"",
				height:0,
				list:[],
				end:false,
				day:0,
				hour:0,
				minute:0,
				second:0,
				timer:null
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
			share({
				title:"砍价0元购",
				desc:'妈妈爱果推出砍价0元购活动，大家都来参与吧',
				imgUrl:"http://ws.tianmaoetong.com/dist/image/bargain/backgroundtop@2x.png",
				link:"/bargain"
			});
			
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			this.height = document.body.offsetHeight;
			
			axios.post("/activity/CutMoney",{},config).then(res => {
				if(res.data.code == 0){
					this.list = res.data.data.proList;
					var time = res.data.data.other.eTime;
					clearInterval(this.timer);
					this.timer = setInterval(() => {
						if(time == 0){
							this.end = true;
							this.alertshow = true;
							this.context = "活动结束";
							setTimeout(() => {
								this.alertshow = false;
							},2000);
						}
						this.day = Math.floor(time/(3600*24));
						this.hour = Math.floor(time%(3600*24)/3600);
						this.minute = Math.floor(time%3600/60);
						this.second = Math.floor(time%60);
						time--;
					},1000)
				}else if(res.data.code == 432){
					this.list = res.data.data.proList;
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