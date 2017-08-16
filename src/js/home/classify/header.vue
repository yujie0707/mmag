<template>
	<div id="classify-header">
		<span>分类</span>
		<v-search></v-search>
	</div>
</template>

<script>
	import Search from "../search.vue";
	export default{
		components:{
			"v-search":Search
		}
	}
</script>

<style>
</style>