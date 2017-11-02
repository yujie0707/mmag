<template>
	<div id="subhome" @scroll="searchShow($el)">
		
		<div style="width: 100%;position: relative;overflow: hidden;">
			<v-swiper :data="oneBanner"></v-swiper>
		</div>
		
		<header class="header-subhome">
			<img src="/dist/image/home/subhome/searchsmal.png" @click="goSearch()" />
		</header>
		
		
		
		<nav class="nav-subhome">
			<div @click="goAnother('/seckill')">
				<img src="/dist/image/home/subhome/miaosha@2x.png" />
				<span>每日秒杀</span>
			</div>
			<div @click="goAnother('/bargain')">
				<img src="/dist/image/home/subhome/lingyuangou@2x.png" />
				<span>0元砍</span>
			</div>
			<div @click="goAnother('/headline')">
				<img src="/dist/image/home/subhome/aiguotoutiao@2x.png" />
				<span>爱果头条</span>
			</div>
			
			<div @click="goAnother('/gift')">
				<img src="/dist/image/home/subhome/aiguoyouli@2x.png" />
				<span>爱果有礼</span>
			</div>
			<div @click="goAnother('/china')">
				<img src="/dist/image/home/subhome/guochanshuiguo@2x.png" />
				<span>国产水果</span>
			</div>
			<div @click="goAnother('/import')">
				<img src="/dist/image/home/subhome/jinkoushuiguo@2x.png" />
				<span>进口水果</span>
			</div>
			<div @click="goAnother('/student')">
				<img src="/dist/image/home/subhome/zhuanqu@2x.png" />
				<span>20元专区</span>
			</div>
			<div @click="goAnother('/everyday')">
				<img src="/dist/image/home/subhome/qiandaohongbao@2x.png" />
				<span>签到红包</span>
			</div>
		</nav>
		
		<div style="height: .2rem;background: #F3F3F3;margin-top: .3rem;"></div>
		
		<div style="padding: 0 0 1rem;width: 100%; overflow: hidden;">
			<h3 class="new">
				<img src="/dist/image/home/subhome/new.png" />每日上新
			</h3>
			<v-swiper-3d :data="hotList"></v-swiper-3d>
		</div>
		
		<div class="banner">
			<img v-lazy="twoBanner.bigimg" style="height: 4.2rem;width: 100%;" @click="goOther(twoBanner.type,twoBanner.url)" />
		</div>
		<v-single v-for="item in indexList" :data="item" ></v-single>
	</div>
</template>

<script>
	
	import Single from "./hotsingle.vue";
	import Swiper from "./swiper.vue";
	import SwiperTd from "./swiper-3d.vue";
	import Store from "../../store/store.js";
	import config from "../../config/config.js";
	import share from "../../share/share.js";
	export default{
		components:{
			"v-swiper":Swiper,
			"v-swiper-3d":SwiperTd,
			"v-single":Single
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/index/WX_Index",{},config).then(res => {
				if(res.data.code == 0){
					this.oneBanner = res.data.data.oneBanner;
					this.twoBanner = res.data.data.twoBanner;
					this.hotList = res.data.data.hotList;
					
					this.indexList = res.data.data.indexList;
					Store.dispatch({
						type:"NUM",
						context: res.data.data.other.carNum
					})
				}
			})
			
			share({});
			
		},
		data(){
			return{
				oneBanner:[],
				hotList:[],
				indexList:[],
				twoBanner:{},
				show:true,
			}
		},
		methods:{
			goOther(type,url){
				if(type == 1){
					this.$router.push(url);
				}else if(type == 2){
					location.href = url;
				}
			},
			searchShow(el){

			},
			goSearch(){
				this.$router.push("/search");
			},
			goAnother(url){
				this.$router.push(url);
			}
		},
		watch:{

		}
	}
</script>

<style>
</style>