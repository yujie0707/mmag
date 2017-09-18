<template>
	<div id="subhome-hot-swiper">
		<div class="swiper-container-hot">
		  <div class="swiper-wrapper">
		    <div class="swiper-slide" v-for="item in data" ><img :src="item.bigimg" style="width: 100%;height: 4.2rem;" class="jumpother"/></div>
		  </div>
		  <div class="swiper-pagination swiper-pagination-p1"></div>
		</div>
	</div>
</template>

<script>
	
	
	export default{
		methods:{
			goOther(url,type){
				if(type == 1){
					this.$router.push(url);
					
				}else if(type == 2){
					location.href = url;
				}else if(type == 3){
					return;
				}
			}
		},
		mounted(){
			setTimeout(()=>{
				var mySwiper = new Swiper('.swiper-container-hot', {
					autoplay: 5000,//可选选项，自动滑动
					pagination : '.swiper-pagination-p1',
					loop:true,
					autoplayDisableOnInteraction : false,
					observer:true,
					observeParents:true,
				})
				for(let i = 0; i < document.querySelectorAll(".jumpother").length; i++){
					var that = this;
					document.querySelectorAll(".jumpother")[i].onclick = function(){
						if(that.data[i-1].type == 1){
							that.$router.push(that.data[i-1].url);
							
						}else if(that.data[i-1].type == 2){
							location.href = that.data[i-1].url;
						}else if(that.data[i-1].type == 3){
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
</style>