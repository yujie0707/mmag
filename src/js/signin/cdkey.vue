<template>
	<div id="cdkey">
		<div class="theme-wrap">
			<img src="/dist/image/cdkey/background_expiry@2x.png" />
			<span>我的积分：{{points}}</span>
			<span @click="goCoupon()">我的优惠券</span>
		</div>
		<div class="single-cdkey" v-for="item in list">
			<div class="single-left">
				<p>￥<span>{{item.price}}</span></p>
				<p>满{{item.priceif}}元可用</p>
			</div>
			<div class="single-right">
				<p>{{item.subject}}</p>
				<p>{{item.life}}</p>
				<p>{{item.integral}}</p>
			</div>
			<button @click="cdkey(item.id)">兑换</button>
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
			"v-alert":Alert
		},
		data(){
			return{
				alertshow:false,
				context:"",
				points:0,
				list:[]
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			share({});
			axios.post("/integral/Prizelist",{},config).then(res => {
				if(res.data.code == 0){
					this.list = res.data.data.data;
					this.points = res.data.data.integral;
				}
			})
		},
		methods:{
			cdkey(id){
				axios.post("/integral/Integralchange",{
					id:id
				},config).then(res => {
					if(res.data.code == 0){
						this.points = res.data.data.integral;
						this.alertshow = true;
						this.context = "兑换成功";
						setTimeout(() => {
							this.alertshow = false;
							
						},1000)
					}else if(res.data.code == 5031){
						this.alertshow = true;
						this.context = "积分数量不足";
						setTimeout(() => {
							this.alertshow = fasle;
						},1000)
					}
				})
			},
			goCoupon(){
				this.$router.push("/coupon/1/0");
			}
		}
	}
</script>

<style>
</style>