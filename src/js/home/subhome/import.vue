<template>
	<div id="subhome-import" :style="{height:height + 'px',overflow:'auto'}" @scroll="saveTop($el)">
		<v-single v-for="item in importList" :data="item"></v-single>
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
				importList:[],
				top:0
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			this.$el.scrollTop = sessionStorage.getItem("importTop") ? sessionStorage.getItem("importTop") : 0;
			axios.post("/index/category",{
				type:4
			},config).then(res => {
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