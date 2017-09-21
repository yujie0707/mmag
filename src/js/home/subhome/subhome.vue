<template>
	<div id="subhome">
		<v-header></v-header>
		<nav>
			<div :class="index == 0 ? 'active' : ''" @click="jumpto(0)">热销</div>
			<div :class="index == 1 ? 'active' : ''" @click="jumpto(1)">采摘</div>
			<div :class="index == 2 ? 'active' : ''" @click="jumpto(2)">进口</div>
			<div :class="index == 3 ? 'active' : ''" @click="jumpto(3)">国产</div>
			<p :style="move"></p>
		</nav>
		<div class="wrap-swiper">
			<div class="swiper-container">
			  <div class="swiper-wrapper">
			    <div class="swiper-slide" style="overflow: hidden;"><v-hot :height="height"></v-hot></div>
			    <div class="swiper-slide"><v-pick ref="pick" :height="height"></v-pick></div>
			    <div class="swiper-slide"><v-import :height="height"></v-import></div>
			    <div class="swiper-slide"><v-china :height="height"></v-china></div>
			  </div>
			</div>
		</div>
	</div>
</template>

<script>
	import Header from "./header.vue";
	import Hot from "./hot.vue";
	import Import from "./import.vue";
	import China from "./china.vue";
	import Pick from "./pick.vue";
	import Store from "../../store/store.js";
	import config from "../../config/config.js";
	export default{
		components:{
			"v-header":Header,
			"v-hot":Hot,
			"v-import":Import,
			"v-china":China,
			"v-pick":Pick
		},
		mounted(){
			
			this.height = document.querySelector(".wrap-swiper").offsetHeight;
			
		},
		activated(){
			var that = this;
			setTimeout(()=>{
				this.swiper = new Swiper('.swiper-container', {
					speed:300,
					autoHeight:true,
					onTransitionEnd: function(swiper){
				        that.index = swiper.activeIndex;
				    }
				})
			},500);
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/ec_shoppingcart/getnum",{},config).then(res => {
				if(res.data.code == 0){
					Store.dispatch({
						type:"NUM",
						context: res.data.data.carNum
					})
				}else if(res.data.code == 2000){
					Store.dispatch({
						type:"NUM",
						context: 0
					})
				}
			})
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		},
		data(){
			return{
				index:0,
				move:{},
				swiper:{},
				height:100
			}
		},
		methods:{
			jumpto(index){
				this.index = index;
				var mySwiper = this.swiper;
				mySwiper.slideTo(index);
			}
		},
		watch:{
			"index":function(){
				this.move = {
					left: document.body.offsetWidth / 4 * this.index + "px"
				}
			}
		}
	}
</script>

<style>
</style>