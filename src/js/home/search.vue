<template>
	<div id="search">
		<img src="/dist/image/home/subhome/search.png" @click="jump()" />
	</div>
</template>

<script>
	export default{
		methods:{
			jump(){
				this.$router.push("/search")
			}
		}
	}
</script>

<style>
</style>