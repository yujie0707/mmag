<template>
	<div id="subhome-import" :style="{height:height + 'px',overflow:'auto'}" @scroll="saveTop($el)">
		<v-single v-for="item in chinaList" :data="item"></v-single>
	</div>
</template>

<script>
	import Single from "./hotsingle.vue";
	import config from "../../config/config.js";
	export default{
		components:{
			"v-single":Single
		},
		data(){
			return{
				chinaList:[],
				top:0
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			this.$el.scrollTop = sessionStorage.getItem("chinaTop") ? sessionStorage.getItem("chinaTop") : 0;
			axios.post("/index/category",{
				type:3
			},config).then(res => {
				if(res.data.code == 0){
					this.chinaList = res.data.data;
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
			sessionStorage.setItem("chinaTop",this.top);
		}
	}
</script>

<style>
</style>