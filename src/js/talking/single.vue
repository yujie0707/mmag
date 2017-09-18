<template>
	<div class="talking-single">
		<div>
			<img v-lazy="data.userImg" class="img" />
			<span>{{data.userPhone}}</span>
			<div class="div">
				<img src="/dist/image/home/subhome/star_good.png" v-for="n in parseInt(data.remarkLevel)" /><img src="/dist/image/home/subhome/star_bad.png" v-for="n in 5-parseInt(data.remarkLevel)" />
			</div>
		</div>
		<p>
			{{data.remarkTime}}
		</p>
		<p>
			{{data.remarkValue}}
		</p>
		<div class="img-wrap">
			<img v-lazy="item" v-for="(item,index) in data.imgMap" @click="showSwiper(index)"/>
		</div>
		
	</div>
</template>

<script>
	export default{
		props:{
			data: Object
		},
		filters:{
			mobile:function(value){
				if(value){
					var arr = value.split("");
					for(var i = 0; i < 4; i++){
						arr[i+3] = "*";
					}
					return arr.join("");
					
				}else{
					return "";
				}
			}
		},
		methods:{
			showSwiper(index){
				this.$parent.show = true;
				this.$parent.showList = this.data.imgMap;
				this.$parent.swiperShow.slideTo(index);
			}
		}
	}
</script>

<style>
</style>