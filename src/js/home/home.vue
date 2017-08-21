<template>
	<div id="home">
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
		<v-footer></v-footer>
		<v-coupon v-if="show" :data="list"></v-coupon>
		<v-alert v-if = "alertshow" context="领取成功"></v-alert>
	</div>
</template>

<script>
	import Coupon from "./coupon.vue";
	import Footer from "./footer.vue";
	import Alert from "../alert.vue";
	export default{
		components:{
			"v-footer":Footer,
			"v-coupon":Coupon,
			"v-alert":Alert
		},
		data(){
			return{
				show:false,
				list:[],
				alertshow:false
			}
		},
		mounted(){	
			axios({
				url:"/index/PushCoupon",
				method:"post",
				headers:{
					"appid": 1,
			        "deviceid": "985ff090eb761e8329c64092ac421adf9afe3",
			        "channelid": "WX",
			        "UserAgent": "WX",
			        "productid": 1,
			        "userid":sessionStorage.getItem("userid"),
			        "usertoken":sessionStorage.getItem("usertoken")
				}
			}).then(res => {
				console.log(res.data.data);
				if(res.data.data.type == 1){
					this.list = res.data.data.data;
					this.show = true;
				}else if(res.data.data.type == 0){
					this.show = false;
				}
				
			})
		},
		beforeRouteEnter(to,from,next){
			if(localStorage.getItem("info")){
				if(JSON.parse(localStorage.getItem("info")).time < new Date().getTime()){
					localStorage.removeItem("info");
					sessionStorage.removeItem("userid");
					sessionStorage.removeItem("usertoken");
					next(vm => {
						vm.$router.push("/");
					});
				}else{
					var time = new Date();
					time = time.getTime() + 3*24*60*60*1000;
					var obj = JSON.parse(localStorage.getItem("info"));
					obj.time = time;
					localStorage.setItem("info",JSON.stringify(obj));
					sessionStorage.setItem("userid",JSON.parse(localStorage.getItem("info")).userid);
					sessionStorage.setItem("usertoken",JSON.parse(localStorage.getItem("info")).usertoken);
					next();
				}
			}else{
				next(vm => {
					vm.$router.push("/");
				});
			}
		}
	}
</script>

<style>
</style>