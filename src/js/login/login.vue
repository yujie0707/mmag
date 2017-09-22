<template>
	<div>
		
	</div>
</template>

<script>
	import config from "../config/config.js";
	export default{
		activated(){
			var wxcode = sessionStorage.getItem("code");
			axios.post("/user/login",{
				mobile: wxcode
			},config).then(res => {
				sessionStorage.setItem("userid",res.data.data.userid);
				sessionStorage.setItem("usertoken",res.data.data.usertoken);

				this.$router.push("/home");
			})
		}
	}
</script>

<style lang="scss">
</style>