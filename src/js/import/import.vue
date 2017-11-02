<template>
	<div id="china">
		<img src="/dist/image/china/import.png" style="width: 100%;" />
		<v-single v-for="item in importList" :data="item"></v-single>
	</div>
</template>

<script>
	import HotSingle from "../home/subhome/hotsingle.vue";
	import config from "../config/config.js";
	import share from "../share/share.js";
	export default{
		components:{
			"v-single":HotSingle
		},
		data(){
			return{
				importList:[]
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			share({
				link:"/import",
				desc:"新鲜健康的进口水果都在这里啊，青岛地区都在这里哦",
				title:"妈妈爱果-进口水果",
				imgUrl:"http://ws.tianmaoetong.com/dist/image/china/import.png"
			})
			axios.post("/index/category",{
				type:4
			},config).then(res => {
				if(res.data.code == 0){
					this.importList = res.data.data;
				}
			})
		}
	}
</script>

<style>
</style>