<template>
	<div id="home-coupon">
		<img src="/dist/image/home/close.png" class="close" @click="close"/>
		<div class="wrap-coupon">
			<img src="/dist/image/home/lingqianla.png" class="hongbao" />
			<div class="list">
				<img :src="item.typeFllow | path" v-for="item in data.data"/>
			</div>
			<button class="get" @click="getnow()">立即领取</button>
		</div>
	</div>
</template>

<script>
	export default{
		props:{
			data:Array
		},
		methods:{
			close(){
				this.$parent.show = false;
			},
			getnow(){
				axios({
					url:"/Coupon/GetCoupon",
					method:"post",
					headers:{
						"appid": 1,
				        "deviceid": "985ff090eb761e8329c64092ac421adf9afe3",
				        "channelid": "WX",
				        "UserAgent": "WX",
				        "productid": 1,
				        "userid":sessionStorage.getItem("userid"),
				        "usertoken":sessionStorage.getItem("usertoken")
					},
					params:{
						activityid: this.data.activityid
					}
				}).then(res => {
					console.log(res.data)
					if(res.data.code == 0){
						this.$parent.show = false;
						this.$parent.alertshow = true;
						setTimeout(() => {
							this.$parent.alertshow = false;
						},1000)
					}
					
				})
			}
		},
		filters:{
			path:function(val){
				switch(val){
					case "1":
					return "/dist/image/home/one.png";
					case "2":
					return "/dist/image/home/two.png";
					case "3":
					return "/dist/image/home/three.png";
					case "4":
					return "/dist/image/home/four.png";
				}
			}
		}
	}
</script>

<style>
</style>