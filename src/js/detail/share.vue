<template>
	<div id="shareAndBack">
		<img src="/dist/image/detail/return.png" @click="goback()" class="img" />
		<img src="/dist/image/detail/fenxiang.png" @click="share()" class="img"/>
		<div id="shareWrap" v-if="show" @click="hide()" :style="{height:height + 'px'}">
			<img src="/dist/image/share.png"/>
		</div>
	</div>
</template>

<script>
	
	export default{
		data(){
			return{
				show:false,
				height: document.body.clientHeight

			}
		},
		methods:{
			goback(){
				this.$router.go(-1);
			},
			share(){
				this.show = true;
			},
			hide(){
				this.show = false;
			}
		},
		activated(){
			this.show = false;
		}
	}
</script>

<style>
</style>