<template>
	<div id="notice">
		<img src="/dist/image/home/close.png" class="close" @click="close"/>
		<div class="notice-wrap">
			<p>妈妈爱果微信商城现全面改版，取消了手机号登录，现仅支持微信登录，老用户若想要查看过往的订单详情，请在公众号“联系客服”的子菜单中下载APP。</p>
			<button @click="know()">我知道了</button>
		</div>
	</div>
</template>

<script>
	import config from "../config/config.js";
	export default{
		mounted(){
			
		},
		methods:{
			close(){
				this.$parent.noticeShow = false;
			},
			know(){
				axios.post("/index/ShowMessage",{
					type:2
				},config).then(res => {
					if(res.data.code == 0){
						this.$parent.noticeShow = false;
					}
				})
			}
		}
	}
</script>

<style>
</style>