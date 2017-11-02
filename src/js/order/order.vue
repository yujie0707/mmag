<template>
	<div id="order">
		<v-header></v-header>
		<v-address></v-address>
	</div>
</template>

<script>
	import Header from "./header.vue";
	import Address from "./address.vue";
	import share from "../share/share.js";
	export default{
		components:{
			"v-header":Header,
			"v-address":Address
		},
		activated(){
			share({});
		},
		deactivated(){
			if(sessionStorage.getItem("coupon")){
				sessionStorage.removeItem("coupon");
				sessionStorage.removeItem("couponid");
			}
		}
	}
</script>

<style>
</style>