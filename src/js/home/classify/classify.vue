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
	export default{
		components:{
			"v-header":Header,
			"v-aside":Aside
			
		},
		data(){
			return {
				
			}
		},
		mounted(){
			axios({
				url:"/ec_shoppingcart/getnum",
				method:"post",
				headers:{
					"appid": 1,
			        "deviceid": "985ff090eb761e8329c64092ac421adf9afe3",
			        "channelid": "WX",
			        "UserAgent": "WX",
			        "productid": 1,
			        "userid":sessionStorage.getItem("userid"),
			        "usertoken":sessionStorage.getItem("usertoken")
				}
			}).then(res => {
				Store.dispatch({
					type:"NUM",
					context: res.data.data.carNum
				})
			})
		},
		activated(){
			axios({
				url:"/ec_shoppingcart/getnum",
				method:"post",
				headers:{
					"appid": 1,
			        "deviceid": "985ff090eb761e8329c64092ac421adf9afe3",
			        "channelid": "WX",
			        "UserAgent": "WX",
			        "productid": 1,
			        "userid":sessionStorage.getItem("userid"),
			        "usertoken":sessionStorage.getItem("usertoken")
				}
			}).then(res => {
				Store.dispatch({
					type:"NUM",
					context: res.data.data.carNum
				})
			})
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		}
	}
</script>

<style>
</style>