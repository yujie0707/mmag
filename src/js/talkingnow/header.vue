<template>
	<header id="talking-now-header">
		<img src="/dist/image/search/return.png" @click="goback()" />
		<span>发表评价</span>
		<span class="change" @click="edit()">发布</span>
	</header>
</template>

<script>
	export default{
		methods:{
			goback(){
				this.$router.go(-1);
			},
			edit(){
				console.log(this.$parent.num,this.$route.params.catid)
				axios({
					url:"/remark/post",
					method:"post",
					headers:{
						"appid": 1,
				        "deviceid": "985ff090eb761e8329c64092ac421adf9afe3",
				        "channelid": "WX",
				        "UserAgent": "WX",
				        "productid": 1,
				        "userid":sessionStorage.getItem("userid"),
				        "usertoken":sessionStorage.getItem("usertoken")
					},
					params:{
						level: this.$parent.num,
						catid: this.$route.params.catid,
						value: this.$parent.value,
						orderid: this.$route.params.orderid,
						file:''
					}
				}).then(res => {
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