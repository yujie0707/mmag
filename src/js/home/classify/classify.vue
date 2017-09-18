<template>
	<div id="classify">
		<v-header></v-header>
		
		<v-aside></v-aside>
	</div>
</template>

<script>
	import Header from "./header.vue";
	import Aside from "./aside.vue";
	import Store from "../../store/store.js";
	import config from "../../config/config.js";
	export default{
		components:{
			"v-header":Header,
			"v-aside":Aside
			
		},
		data(){
			return {
				
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/ec_shoppingcart/getnum",{},config).then(res => {
				if(res.data.code == 0){
					Store.dispatch({
						type:"NUM",
						context: res.data.data.carNum
					})
				}else if(res.data.code == 2000){
					Store.dispatch({
						type:"NUM",
						context: 0
					})
				}
			})
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		}
	}
</script>

<style>
</style>