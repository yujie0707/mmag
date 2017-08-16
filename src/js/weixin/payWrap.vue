<template>
	<div id="payWrap">
		<v-weixin v-if="show"></v-weixin>
		<v-paySuccess v-else></v-paySuccess>
	</div>
</template>

<script>
	import Weixin from "./weixin.vue";
	import paySuccess from "./paySuccess.vue";
	export default{
		components:{
			"v-weixin": Weixin,
			"v-paySuccess": paySuccess
		},
		data(){
			return{
				show:true
			}
		},
		activated(){
			this.show = true;
			wx.hideOptionMenu();
			
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