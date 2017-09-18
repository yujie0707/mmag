<template>
	<div id="allorder">
		<div id="allorder-header">
			<img src="/dist/image/search/return.png" @click="goback()" />
			<span>我的订单</span>
		</div>
		<nav>
			<div :class="index == 0 ? 'active' : ''" @click="jumpto(0)">全部</div>
			<div :class="index == 1 ? 'active' : ''" @click="jumpto(1)">待付款</div>
			<div :class="index == 2 ? 'active' : ''" @click="jumpto(2)">待发货</div>
			<div :class="index == 3 ? 'active' : ''" @click="jumpto(3)">待确认</div>
			<div :class="index == 4 ? 'active' : ''" @click="jumpto(4)">已完成</div>
			<div :class="index == 5 ? 'active' : ''" @click="jumpto(5)">待退款</div>
			<p :style="move"></p>
		</nav>
		<div class="wrap-swiper">
			<div class="swiper-container">
			  <div class="swiper-wrapper">
			    <div class="swiper-slide">
			    	<v-all ref="all" type="6" :height="height"></v-all>
			    </div>
			    <div class="swiper-slide">
			    	<v-all ref="pay" type="1" :height="height"></v-all>
			    </div>
			    <div class="swiper-slide">
			    	<v-all ref="send" type="2" :height="height"></v-all>
			    </div>
			    <div class="swiper-slide">
			    	<v-all ref="yes" type="3" :height="height"></v-all>
			    </div>
			    <div class="swiper-slide">
			    	<v-all ref="complete" type="5" :height="height"></v-all>
			    </div>
			    <div class="swiper-slide">
			    	<v-all ref="refund" type="4" :height="height"></v-all>
			    </div>
			  </div>
			</div>
		</div>
	</div>
</template>

<script>
	import All from "./all.vue";
	export default{
		components:{
			"v-all":All
		},
		data(){
			return{
				index:0,
				move:{},
				swiper:{},
				height:0
			}
		},
		mounted(){
			
			var that = this;
			setTimeout(()=>{
				this.swiper = new Swiper('.swiper-container', {
					speed:300,
					initialSlide: sessionStorage.getItem("index"),
					autoHeight:true,
					onTransitionEnd: function(swiper){
				        that.index = swiper.activeIndex;
				    }
				})
				
			},500);
			this.height = document.querySelector(".wrap-swiper").offsetHeight;
		},
		methods:{
			jumpto(index){
				this.index = index;
				var mySwiper = this.swiper;
				mySwiper.slideTo(index);
			},
			goback(){
				this.$router.go(-1);
			}
		},
		watch:{
			"index":function(){
				
				this.move = {
					left: document.body.offsetWidth / 6 * this.index + "px"
				}
				sessionStorage.setItem("index",this.index);
			}
		},
		activated(){
			var mySwiper = this.swiper;
			mySwiper.slideTo(sessionStorage.getItem("index"));
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		}
	}
</script>

<style>
</style>