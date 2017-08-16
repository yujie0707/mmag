<template>
	<div id="subhome-hot" :style="{height:height + 'px',overflow:'auto'}" @scroll="saveTop($el)">
		<div style="width: 100%;position: relative;overflow: hidden;">
			<v-swiper :data="swiperlist"></v-swiper>
		</div>
		<v-single v-for="item in hotlist" :data="item"></v-single>
	</div>
</template>

<script>
	import Swiper from "./swiper.vue";
	import Single from "./hotsingle.vue";
	import Store from "../../store/store.js";
	
	export default{
		components:{
			"v-swiper":Swiper,
			"v-single":Single
		},
		activated(){
			axios({
				url:"http://ws.tianmaoetong.com/index/category",
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
					type:1
				}
			}).then(res => {
				if(res.data.code == 0){
					this.swiperlist = res.data.data.focus;
					this.hotlist = res.data.data.hotList;
				}
			})
			this.$el.scrollTop = sessionStorage.getItem("hotTop") ? sessionStorage.getItem("hotTop") : 0;
		},
		data(){
			return {
				swiperlist:[],
				hotlist:[],
				top:0
			}
		},
		props:{
			'height':Number
		},
		deactivated(){
			sessionStorage.setItem("hotTop",this.top)
		},
		methods:{
			saveTop(el){
				this.top = el.scrollTop;
			}
		}
	}
	
</script>

<style>
</style>