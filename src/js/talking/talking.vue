<template>
	<div id="talking">
		<div id="talking-header">
			<img src="/dist/image/search/return.png" @click="goback()" />
			<span>全部评论</span>
		</div>
		<nav>
			<div :class="index == 0 ? 'active' : ''" @click="jumpto(0)">好评</div>
			<div :class="index == 1 ? 'active' : ''" @click="jumpto(1)">有图</div>
			<div :class="index == 2 ? 'active' : ''" @click="jumpto(2)">差评</div>
			<p :style="move"></p>
		</nav>
		<div class="wrap-swiper">
			<div class="swiper-container">
			  <div class="swiper-wrapper">
			    <div class="swiper-slide">
			    	<v-single :data="item" v-for="item in goodList"></v-single>
			    </div>
			    <div class="swiper-slide">
			    	<v-single :data="item" v-for="item in imgList"></v-single>
			    </div>
			    <div class="swiper-slide">
			    	<v-single :data="item" v-for="item in badList"></v-single>
			    </div>
			  </div>
			</div>
		</div>
		<div class="wrap-swiper-show" v-show="show" @click="close()">
			<div class="swiper-container-show">
			  <div class="swiper-wrapper">
			    <div class="swiper-slide" v-for="item in showList">
			    	<div :style="{height:height + 'px',position:relative}">
				    	<img :src="item" style="width: 100%;position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;"/>
			    	</div>
			    </div>
			  </div>
			</div>
		</div>
	</div>
</template>

<script>
	import Single from "./single.vue";
	export default{
		components:{
			"v-single":Single
		},
		
		data(){
			return{
				index:0,
				move:{},
				swiper:{},
				swiperShow:{},
				goodList:[],
				imgList:[],
				badList:[],
				showLisr:[],
				show:false,
				height:document.body.offsetHeight
			}
		},
		methods:{
			jumpto(index){
				this.index = index;
				var mySwiper = this.swiper;
				mySwiper.slideTo(index);
			},
			goback(){
				this.$router.go(-1);
			},
			close(){
				this.show = false;
			}
		},
		watch:{
			"index":function(){
				
				this.move = {
					left: document.body.offsetWidth / 3 * this.index + "px"
				}
			}
		},
		activated(){
			this.show = false;
			var that = this;
			setTimeout(()=>{
				this.swiper = new Swiper('.swiper-container', {
					speed:300,
					autoHeight:true,
					onTransitionEnd: function(swiper){
				        that.index = swiper.activeIndex;
				    },
				    onInit: function(swiper){
						swiper.slideTo(0);
					}
				})
				this.swiperShow = new Swiper('.swiper-container-show', {
					speed:300,
					autoHeight:true,
					observer:true,
					observeParents:true,
				})
			},500);
			axios({
				url:"/remark/search",
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
					type: 1,
					catid: this.$route.params.catid
				}
			}).then(res => {
				if(res.data.code == 0){
					this.goodList = res.data.data;
				}else{
					this.goodList = [];
				}
			})
			axios({
				url:"/remark/search",
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
					type: 2,
					catid: this.$route.params.catid
				}
			}).then(res => {
				if(res.data.code == 0){
					this.imgList = res.data.data;
				}else{
					this.imgList = [];
				}
			})
			axios({
				url:"/remark/search",
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
					type: 4,
					catid: this.$route.params.catid
				}
			}).then(res => {
				if(res.data.code == 0){
					this.badList = res.data.data;
				}else{
					this.badList = [];
				}
			})
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		},
		beforeRouteEnter(to,from,next){
			if(localStorage.getItem("info")){
				if(JSON.parse(localStorage.getItem("info")).time < new Date().getTime()){
					localStorage.removeItem("info");
					sessionStorage.removeItem("userid");
					sessionStorage.removeItem("usertoken");
					next(vm => {
						vm.$router.push("/");
					});
				}else{
					var time = new Date();
					time = time.getTime() + 3*24*60*60*1000;
					var obj = JSON.parse(localStorage.getItem("info"));
					obj.time = time;
					localStorage.setItem("info",JSON.stringify(obj));
					sessionStorage.setItem("userid",JSON.parse(localStorage.getItem("info")).userid);
					sessionStorage.setItem("usertoken",JSON.parse(localStorage.getItem("info")).usertoken);
					next();
				}
			}else{
				next(vm => {
					vm.$router.push("/");
				});
			}
		}
	}
</script>

<style>
</style>