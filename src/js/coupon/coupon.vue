<template>
	<div id="coupon">
		<v-header></v-header>
		<v-empty v-if="show"></v-empty>
		<div id="list" v-else>
			<v-single v-for="item in list" :data="item"></v-single>
		</div>
	</div>
</template>

<script>
	import Header from "./header.vue";
	import Single from "./single.vue";
	import Empty from "./empty.vue";
	export default{
		components:{
			"v-header":Header,
			"v-empty":Empty,
			"v-single":Single
		},
		data(){
			return{
				show:true,
				list:[]
			}
		},
		activated(){
			if(this.$route.params.type == 1){
				axios({
					url:"/Coupon/GetList",
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
						type:3
					}
				}).then(res => {
					console.log(res);
					this.list = res.data.data;
					this.show = res.data.data.length == 0 ? true : false
				})
			}else if(this.$route.params.type == 2){
				axios({
					url:"/Coupon/GetList",
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
						type: 1,
						money: this.$route.params.money
					}
				}).then(res => {
					console.log(res);
					this.list = res.data.data;
					this.show = res.data.data.length == 0 ? true : false
				})
			}
		}
	}
</script>

<style>
</style>