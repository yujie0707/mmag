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
	import config from "../config/config.js";
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
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			if(this.$route.params.type == 1){
				axios.post("/Coupon/GetList",{
					type:3
				},config).then(res => {
					console.log(res);
					this.list = res.data.data;
					this.show = res.data.data.length == 0 ? true : false
				})
			}else if(this.$route.params.type == 2){
				axios.post("/Coupon/GetList",{
					type: 1,
					money: this.$route.params.money
				},config).then(res => {
					this.list = res.data.data;
					this.show = res.data.data.length == 0 ? true : false
				})
			}
		}
	}
</script>

<style>
</style>