<template>
	<div id="orderDetail-header">
		<img src="/dist/image/search/return.png" @click="goback()" />
		<span>订单详情</span>
	</div>
</template>

<script>
	export default{
		methods:{
			goback(){
				this.$router.go(-1);
			}
		}
	}
</script>

<style>
</style>