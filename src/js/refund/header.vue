<template>
	<div id="order-header">
		<img src="/dist/image/search/return.png" @click="goback()" />
		<span>申请退款</span>
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