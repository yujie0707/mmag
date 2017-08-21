<template>
	<header>
		<img src="/dist/image/search/return.png" @click="goback()" />
		<span>优惠券</span>
	</header>
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