<template>
	<div id="shopping-empty">
		<img src="/dist/image/home/shopping/chahua.png" class="empty-bg" />
		<span>你还没有添加商品</span>
		<input type="button" class="goHome" value="去逛逛" @click="gohome()" />
	</div>
</template>

<script>
	export default{
		methods:{
			gohome(){
				sessionStorage.setItem("cur",0);
				this.$router.push("/home");
			}
		}
	}
</script>

<style>
</style>