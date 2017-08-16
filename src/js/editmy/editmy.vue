<template>
	<div id="editmy">
		<v-header></v-header>
		<div class="img">
			<span>头像</span>
			<img src="/dist/image/address/more.png" />
			<img v-lazy="$route.params.img" />
		</div>
		<div class="phone">
			<span>账号</span>
			<img src="/dist/image/address/more.png" />			
			<span>{{$route.params.phone}}</span>
		</div>
		<div class="password">
			<span>密码</span>
			<img src="/dist/image/address/more.png" />
			<span>修改</span>
			
		</div>
		<button class="exit" @click="exit()">
			退出登录
		</button>
	</div>
</template>

<script>
	import Header from "./header.vue";
	export default{
		components:{
			"v-header":Header
		},
		methods:{
			exit(){
				localStorage.removeItem("info");
				sessionStorage.removeItem("city");
				sessionStorage.removeItem("fail");
				sessionStorage.removeItem("lat");
				sessionStorage.removeItem("lng");
				
				this.$router.push("/");
			}
		},
		activated(){
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		},
		beforeRouteEnter(to,from,next){
			if(localStorage.getItem("info")){
				if(JSON.parse(localStorage.getItem("info")).time < new Date().getTime()){
					localStorage.removeItem("info");
					sessionStorage.removeItem("userid");
					sessionStorage.removeItem("usertoken");
					next(vm => {
						vm.$router.push("/");
					});
				}else{
					var time = new Date();
					time = time.getTime() + 3*24*60*60*1000;
					var obj = JSON.parse(localStorage.getItem("info"));
					obj.time = time;
					localStorage.setItem("info",JSON.stringify(obj));
					sessionStorage.setItem("userid",JSON.parse(localStorage.getItem("info")).userid);
					sessionStorage.setItem("usertoken",JSON.parse(localStorage.getItem("info")).usertoken);
					next();
				}
			}else{
				next(vm => {
					vm.$router.push("/");
				});
			}
		}
	}
</script>

<style>
</style>