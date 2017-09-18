<template>
	<div id="shopping-header">
		购物车
		<span @click="del($el)">删除</span>
	</div>
</template>

<script>
	import Store from "../../store/store.js";
	import config from "../../config/config.js";
	export default{
		methods:{
			del(el){
				
				var list = [];
				var llist = this.$parent.$refs.list.list;
				var choose = this.$parent.$refs.list.choose;
				if(llist.length == 0 || choose.every(cur => cur == false)){
					return;
				}
				var orderid = '';
				for(var i = choose.length - 1; i >= 0; i--){
					if(choose[i]){
						list.push(llist[i].orderid);
						llist.splice(i,1);
						choose.splice(i,1);
					}
				}
				orderid = list.join("_");
				axios.post("/ec_shoppingcart/delete",{
					orderids:orderid
				},config).then(res => {
					Store.dispatch({
						type:"NUM",
						context: res.data.data.carNum
					})
					this.$parent.$refs.list.list = llist;
					this.$parent.$refs.list.choose = choose;
					
				})
			}
		}
	}
</script>

<style>
</style>