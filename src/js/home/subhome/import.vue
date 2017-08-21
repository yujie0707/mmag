<template>
	<div id="subhome-import" :style="{height:height + 'px',overflow:'auto'}" @scroll="saveTop($el)">
		<v-single v-for="item in importList" :data="item"></v-single>
	</div>
</template>

<script>
	import Single from "./hotsingle.vue";
	export default{
		components:{
			"v-single":Single
		},
		data(){
			return{
				importList:[],
				top:0
			}
		},
		activated(){
			this.$el.scrollTop = sessionStorage.getItem("importTop") ? sessionStorage.getItem("importTop") : 0;
			axios({
				url:"/index/category",
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
					type:4
				}
			}).then(res => {
				console.log(res);
				if(res.data.code == 0){
					this.importList = res.data.data;
				}
			})
		},
		props:{
			'height':Number
		},
		methods:{
			saveTop(el){
				this.top = el.scrollTop;
			}
		},
		deactivated(){
			sessionStorage.setItem("importTop",this.top);
		}
	}
</script>

<style>
</style>