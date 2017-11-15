<template>
	<div id="subhome-3d-swiper" style="width: 100%;">
		<div class="swiper-container-3d">
		  <div class="swiper-wrapper">
		    <div class="swiper-slide" v-for="item in data" style="border-radius: .2rem; overflow: hidden;" >
		    	<router-link :to="{name:'detail',params:{id:item.catid}}">
			    	<div class="wrap-prd">
				    	<img :src="item.img" style="width: 100%;height: 2.55rem;"/>
			    		<p>{{item.name}}</p>
			    		<p>一件起售  {{item.details}}</p>
			    		<p>￥{{item.money}}{{item.mbn_detailsType | type}}</p>
			    		<button>立即购买</button>
			    	</div>
		    	</router-link>
		    </div>
		  </div>
		</div>
	</div>
</template>

<script>
	
	
	export default{
		mounted(){
			setTimeout(()=>{
				var mySwiper = new Swiper('.swiper-container-3d', {
					effect: 'coverflow',
					slidesPerView: 2,
					centeredSlides: true,
					coverflow: {
			            rotate: 30,
			            stretch: 10,
			            depth: 60,
			            modifier: 2,
			            slideShadows : true
					},
					observer:true,
					observeParents:true,
					loop:true
				})
			},500)
		},
		props:{
			data:Array,
		},
		filters:{
			type(val){
				return val == 1 ? "/斤" : "/个";
			}
		},
		methods:{
			
		}
	}
</script>

<style>
</style>