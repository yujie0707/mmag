<template>
	<div id="china">
		<img src="/dist/image/china/china.png" style="width: 100%;" />
		<v-single v-for="item in chinaList" :data="item"></v-single>
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
				chinaList:[]
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			share({
				link:"/china",
				desc:"新鲜健康的国产水果都在这里啊，青岛地区都在这里哦",
				title:"妈妈爱果-国产水果",
				imgUrl:"http://ws.tianmaoetong.com/dist/image/china/china.png"
			})
			axios.post("/index/category",{
				type:3
			},config).then(res => {
				if(res.data.code == 0){
					this.chinaList = res.data.data;
				}
			})
		}
	}
</script>

<style>
</style>