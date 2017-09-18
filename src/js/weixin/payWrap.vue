<template>
	<div id="payWrap">
		<v-weixin v-if="show"></v-weixin>
		<v-paySuccess v-else></v-paySuccess>
	</div>
</template>

<script>
	import Weixin from "./weixin.vue";
	import paySuccess from "./paySuccess.vue";
	export default{
		components:{
			"v-weixin": Weixin,
			"v-paySuccess": paySuccess
		},
		data(){
			return{
				show:true
			}
		},
		activated(){
			this.show = true;
			wx.hideOptionMenu();
			
		}
	}
</script>

<style>
</style>