<template>
	<div id="shopping">
		<v-header></v-header>
		<v-empty v-if="carNum == 0"></v-empty>
		<v-list v-else ref="list"></v-list>
	</div>
</template>

<script>
	import Store from "../../store/store.js";
	import Header from "./header.vue";
	import Empty from "./body-empty.vue"; 
	import List from "./body-list.vue";
	import config from "../../config/config.js";
	export default{
		components:{
			"v-header":Header,
			"v-empty":Empty,
			"v-list":List
		},
		mounted(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/ec_shoppingcart/getnum",{},config).then(res => {
				Store.dispatch({
					type:"NUM",
					context: res.data.data.carNum
				})
				this.carNum = res.data.data.carNum;
			})
			Store.subscribe(() => {
				this.carNum = Store.getState().carNum;
			})
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/ec_shoppingcart/getnum",{},config).then(res => {
				Store.dispatch({
					type:"NUM",
					context: res.data.data.carNum
				})
				this.carNum = res.data.data.carNum;
			})
			Store.subscribe(() => {
				this.carNum = Store.getState().carNum;
			})
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		},
		data(){
			return{
				carNum: Store.getState().carNum,
			}
		}
	}
</script>

<style>
</style>