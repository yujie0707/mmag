<template>
	
	<div id="headline">
		<div class="single-headline" v-for="item in headList" @click="goVideo(item.id)">
			<p>{{item.title}}</p>
			<p>{{item.subTitle}}</p>
			<div class="img-wrap">
				<img v-lazy="item.imgUrl" />
				<img src="/dist/image/video/start.png" v-if="item.type == 1" />
			</div>
		</div>
	</div>
</template>

<script>
	import config from "../config/config.js";
	import share from "../share/share.js";
	export default{
		data(){
			return{
				headList:[]
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			share({
				title:"爱果头条",
				desc:"这里每天都有关于水果的文章或视频，快来关注啊",
				link:"/headline"
			});
			axios.post('/news/Getlist',{},config).then(res => {
				if(res.data.code == 0){
					this.headList = res.data.data;
				}
			})
		},
		methods:{
			goVideo(id){
				this.$router.push({
					name:"video",
					params:{
						id:id
					}
				})
			}
		}
	}
</script>

<style>
</style>