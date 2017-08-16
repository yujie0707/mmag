<template>
	<div id="orderDetail-header">
		<img src="/dist/image/search/return.png" @click="goback()" />
		<span>我的账号</span>
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