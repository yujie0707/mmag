<template>
	<div>
		
	</div>
</template>

<script>
	
	import config from "../config/config.js";
	export default{
		
		activated(){
			var wxcode = sessionStorage.getItem("code");
			if(sessionStorage.getItem("codeOnce") == 1){
				wx.ready(function(){
					wx.closeWindow();
				})
			}else{
				axios.post("/user/login",{
					mobile: wxcode
				},config).then(res => {
					sessionStorage.setItem("userid",res.data.data.userid);
					sessionStorage.setItem("usertoken",res.data.data.usertoken);
					sessionStorage.setItem("codeOnce",1);
					if(sessionStorage.getItem("path")){
						var arr = sessionStorage.getItem("path").split("*");
						sessionStorage.removeItem("path");
						if(arr.length == 1){
							this.$router.push(arr[0]);
						}else{
							this.$router.push(arr[0]);
							sessionStorage.setItem("shareid",arr[1]);
						}
					}else{
						this.$router.push("/home/");
					}
				})
				
			}
		},
		
	}
</script>

<style lang="scss">
</style>