<template>
	<div id="subhome-hot-swiper">
		<div class="swiper-container-hot">
		  <div class="swiper-wrapper">
		    <div class="swiper-slide" v-for="item in data" ><img :src="item.bigimg" style="width: 100%;height: 4.2rem;border-radius: .15rem;" class="jumpother"/></div>
		  </div>
		</div>
	</div>
</template>

<script>
	
	
	export default{
		mounted(){
			setTimeout(()=>{
				var mySwiper = new Swiper('.swiper-container-hot', {
					autoplay: 5000,//可选选项，自动滑动
					loop:true,
					autoplayDisableOnInteraction : false,
					observer:true,
					observeParents:true,
					slidesPerView : 1,
					spaceBetween : -45
				})
				for(let i = 0; i < document.querySelectorAll(".jumpother").length; i++){
					var that = this;
					document.querySelectorAll(".jumpother")[i].onclick = function(){
						if(that.data[(i-1)%that.data.length].type == 1){
							that.$router.push(that.data[(i-1)%that.data.length].url);
						}else if(that.data[(i-1)%that.data.length].type == 2){
							location.href = that.data[(i-1)%that.data.length].url;
						}else if(that.data[(i-1)%that.data.length].type == 3){
							return;
						}
					}
				}
			},500)
		},
		props:{
			data:Array,
		}
	}
</script>

<style>
	.swiper-container-hot .swiper-pagination-bullet-active{
		background: #fff;
	}
	
	.swiper-container-hot .swiper-slide{
		text-align: center;
		transition: all .3s;
		transform: scale(.8,.8);
	}
	
	.swiper-container-hot .swiper-slide-active{
		transform: scale(.9,.9);
	}
</style>