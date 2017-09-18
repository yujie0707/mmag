<template>
	<div id="home-coupon">
		<img src="/dist/image/home/close.png" class="close" @click="close"/>
		<div class="wrap-coupon">
			<img src="/dist/image/home/lingqianla.png" class="hongbao" />
			<div class="list">
				<img :src="item.img" v-for="item in data.data"/>
			</div>
			<button class="get" @click="getnow()">立即领取</button>
		</div>
	</div>
</template>

<script>
	import config from "../config/config.js";
	export default{
		props:{
			data:Array
		},
		methods:{
			close(){
				this.$parent.show = false;
			},
			getnow(){
				config.headers.userid = sessionStorage.getItem("userid");
				config.headers.usertoken = sessionStorage.getItem("usertoken");
				axios.post("/Coupon/GetCoupon",{
					activityid: this.data.activityid
				},config).then(res => {
					if(res.data.code == 0){
						this.$parent.show = false;
						this.$parent.alertshow = true;
						this.$parent.context = "领取成功";
						setTimeout(() => {
							this.$parent.alertshow = false;
						},1000)
					}else if(res.data.code == 4212){
						this.$parent.show = false;
						this.$parent.alertshow = true;
						this.$parent.context = "您已经领取过该优惠券";
						setTimeout(() => {
							this.$parent.alertshow = false;
						},1000)
					}
					
				})
			}
		}
	}
</script>

<style>
</style>