<template>
	<header id="talking-now-header">
		<img src="/dist/image/search/return.png" @click="goback()" />
		<span>发表评价</span>
		<span class="change" @click="edit()">发布</span>
	</header>
</template>

<script>
	import config from "../config/config.js";
	export default{
		methods:{
			goback(){
				this.$router.go(-1);
			},
			edit(){
				if(this.$parent.num == 0){
					this.$parent.alertshow = true;
					this.$parent.context = "请选择星星";
					setTimeout(() => {
						this.$parent.alertshow = false;
					},1000)
					return;
				}
				if(this.$parent.value == ""){
					this.$parent.alertshow = true;
					this.$parent.context = "评价内容不能为空";
					setTimeout(() => {
						this.$parent.alertshow = false;
					},1000)
				}
				config.headers.userid = sessionStorage.getItem("userid");
				config.headers.usertoken = sessionStorage.getItem("usertoken");
				axios.post("/remark/post",{
					level: this.$parent.num,
					catid: this.$route.params.catid,
					value: this.$parent.value,
					orderid: this.$route.params.orderid,
					file:''
				},config).then(res => {
					if(res.data.code == 0){
						alert("添加评论成功");
						this.$router.go(-1);
						sessionStorage.setItem("index",4);
					}
				})
			}
		}
	}
</script>

<style>
</style>