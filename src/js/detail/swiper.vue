<template>
	<div id="subhome-hot-swiper">
		<div class="swiper-container-hot">
		  <div class="swiper-wrapper">
		    <div class="swiper-slide" v-for="item in data"><img :src="item.img" style="width: 100%;"/></div>
		  </div>
		  <div class="swiper-pagination swiper-pagination-p1"></div>
		</div>
	</div>
</template>

<script>
	
	
	export default{
		data(){
			return {
				mySwiper:''
			}
		},
		mounted(){
			
			setTimeout(()=>{
				this.mySwiper = new Swiper('.swiper-container-hot', {
					
					autoplay: 5000,//可选选项，自动滑动
					pagination : '.swiper-pagination-p1',
					loop:true,
					autoplayDisableOnInteraction : false,
					observer:true,
					observeParents:true,
					
				})
								
			},500)
		},
		props:{
			data:Array,
		},
		activated(){
			setTimeout(() => {
				this.mySwiper.init();
				
			},500)
		}
	}
</script>

<style>
</style>