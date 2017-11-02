<template>
	<div id="video">
		
		
		<div v-if="isvideo" class="video">
			<iframe frameborder="0" style="margin: 0 auto .4rem;display: block;" :width="width" :height="height" :src="videoUrl" allowfullscreen></iframe>
			<p class="title">{{title}}</p>
			<p>{{subTitle}}</p>
			<p>播放次数：{{focusnum}}</p>
		</div>
		<div v-else class="article">
			<p class="title">{{title}}</p>
			<p class="num">阅读量：{{focusnum}}</p>
			<div class="article-wrap" v-for="item in list">
				<img v-lazy="item.img" />
				<p>{{item.content}}</p>
			</div>
		</div>
		<div style="height: .2rem;background: #f3f3f3;"></div>
		<h3 class="baby">相关宝贝</h3>
		<div class="like" v-for="item in likeList" @click="goDetail(item.catid)">
			<img v-lazy="item.img" />
			<div class="detail-wrap">
				<p>{{item.proName}} {{item.mixDetails}}</p>
				<p>一件起售 {{item.singleDetails}}</p>
				<img src="/dist/image/video/right.png" />
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
				width:0,
				height:0,
				title:"",
				focusnum:0,
				isvideo:false,
				subTitle:"",
				videoUrl:"",
				list:[],
				likeList:[]
			}
		},
		activated(){
			this.width = document.body.offsetWidth;
			this.height = document.body.offsetWidth*0.65;
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/news/Getitem",{
				id:this.$route.params.id
			},config).then(res => {
				if(res.data.code == 0){
					
					this.title = res.data.data.header.title;
					this.focusnum = res.data.data.header.focusNum;
					this.subTitle = res.data.data.header.subTitle;
					this.isvideo = res.data.data.header.type == 1 ? true : false;
					this.likeList = res.data.data.tail;
					if(res.data.data.header.type == 1){
						this.videoUrl = res.data.data.body[0].videoUrl;
					}else{
						this.list = res.data.data.body;
					}
					var that = this;
					share({
						title:res.data.data.header.title,
						desc:res.data.data.header.subTitle,
						link:"/video/" + that.$route.params.id
					})
				}
			})
		},
		methods:{
			goDetail(id){
				this.$router.push("/detail/" + id);
			}
		}
	}
</script>

<style>
</style>