<template>
	<div id="classify">
		<v-header></v-header>
		
		<v-aside></v-aside>
	</div>
</template>

<script>
	import Header from "./header.vue";
	import Aside from "./aside.vue";
	import Store from "../../store/store.js";
	import config from "../../config/config.js";
	import share from "../../share/share.js";
	export default{
		components:{
			"v-header":Header,
			"v-aside":Aside
			
		},
		data(){
			return {
				
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			share({});
			axios.post("/ec_shoppingcart/getnum",{},config).then(res => {
				if(res.data.code == 0){
					Store.dispatch({
						type:"NUM",
						context: res.data.data.carNum
					})
				}else if(res.data.code == 2000){
					Store.dispatch({
						type:"NUM",
						context: 0
					})
				}
			})
			
		}
	}
</script>

<style>
</style>