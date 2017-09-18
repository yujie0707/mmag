<template>
	<div id="comble">
		<v-addAddress v-show="show" ref="one"></v-addAddress>
		<v-searchAddress v-show="!show" ref="two"></v-searchAddress>
	</div>
</template>

<script>
	import addAddress from "./addAddress.vue";
	import searchAddress from "./searchAddress.vue";
	export default{
		components:{
			"v-addAddress": addAddress,
			"v-searchAddress": searchAddress
		},
		data(){
			return{
				show:true
			}
		},
		activated(){
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		}
	}
	
</script>

<style>
</style>