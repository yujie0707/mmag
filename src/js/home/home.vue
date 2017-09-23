<template>
	<div id="home">
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
		<v-footer></v-footer>
		<v-coupon v-if="show" :data="list"></v-coupon>
		<v-notice v-if="noticeShow"></v-notice>
		<v-alert v-if = "alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import Coupon from "./coupon.vue";
	import Footer from "./footer.vue";
	import Alert from "../alert.vue";
	import Notice from "./notice.vue";
	import config from "../config/config.js";
	export default{
		components:{
			"v-footer":Footer,
			"v-coupon":Coupon,
			"v-alert":Alert,
			"v-notice":Notice
		},
		data(){
			return{
				show:false,
				list:[],
				alertshow:false,
				context:"",
				noticeShow:false
			}
		},
		mounted(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/index/PushCoupon",{},config).then(res => {
				if(res.data.data.type == 1){
					this.list = res.data.data.data;
					this.show = true;
				}else if(res.data.data.type == 0){
					this.show = false;
				}
			})
			axios.post("/index/ShowMessage",{
				type:1
			},config).then(res => {
				if(res.data.data.isShow == 2){
					this.noticeShow = true;
				}else{
					this.noticeShow = false;
				}
			})
		}
	}
</script>

<style>
</style>