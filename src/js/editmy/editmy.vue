<template>
	<div id="editmy">
		<v-header></v-header>
		<div class="img">
			<span>头像</span>
			<img src="/dist/image/address/more.png" />
			<img v-lazy="$route.params.head" />
		</div>
		<div class="phone">
			<span>昵称</span>
			<img src="/dist/image/address/more.png" />			
			<span>{{$route.params.name}}</span>
		</div>
		<button class="exit" @click="exit()">
			同步微信信息
		</button>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import Header from "./header.vue";
	import config from "../config/config.js";
	import alert from "../alert.vue";
	export default{
		components:{
			"v-alert":alert,
			"v-header":Header
		},
		data(){
			return {
				alertshow: false,
				context: ""
			}
		},
		methods:{
			exit(){
				axios.post("/user/UpdateUserInfo",{},config).then(res => {
					if(res.data.code == 0){
						this.alertshow = true;
						this.context = "同步成功";
						setTimeout(() => {
							this.alertshow = false;
						},1000)
						this.$route.params.head = res.data.data.avatar;
						this.$route.params.name = res.data.data.nickname;
					}else{
						this.alertshow = true;
						this.context = "同步失败，请重新尝试";
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}
				})
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