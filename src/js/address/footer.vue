<template>
	<footer>
		<button @click="add()">新增地址</button>
	</footer>
</template>

<script>
	export default{
		methods:{
			add(){
				this.$router.push("/addAddress");
			}
		}
	}
</script>

<style>
</style>