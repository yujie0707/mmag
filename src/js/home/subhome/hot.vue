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
	import config from "../../config/config.js";
	export default{
		components:{
			"v-swiper":Swiper,
			"v-single":Single
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/index/category",{
				type:1
			},config).then(res => {
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