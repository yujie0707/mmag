<template>
	<div id="weixin">
		<v-header></v-header>
		<div id="totalTime">
			<p>支付剩余时间</p>
			<p><span>10</span>分<span>00</span>秒 </p>
		</div>
		<div id="totalMoney">
			<span>应付金额</span>
			<span>￥{{money}}</span>
		</div>
		<div id="methods">
			<p class="choose">支付方式</p>
			<p class="weixin">
				<img src="/dist/image/weixin/weixin.png" />
				<span>微信支付</span>
				<img src="/dist/image/home/shopping/xuanzhong.png" />
			</p>
		</div>
		<button class="payNow" @click="payNow()">立即支付</button>
		<v-alert v-if="alertshow" context="支付失败，请重新支付"></v-alert>
	</div>
</template>

<script>
	import Store from "../store/store.js";
	import Header from "../order/header.vue";
	import Alert from "../alert.vue";
	import config from "../config/config.js";
	export default{
		components:{
			"v-header":Header,
			"v-alert": Alert
		},
		data(){
			return{
				money:0,
				orderid:"",
				alertshow: false
			}
		},
		methods:{
			payNow(){
				axios.post("/ec_pay/pay",{
					type:3,
					orderid: this.orderid,
					total_amount: this.money
				},config).then(res => {
					var that = this;
				    WeixinJSBridge.invoke('getBrandWCPayRequest', {
				           "appId": res.data.data.appId,     //公众号名称，由商户传入     
				           "timeStamp": res.data.data.timeStamp,//时间戳，自1970年以来的秒数     
				           "nonceStr": res.data.data.nonceStr, //随机串     
				           "package": res.data.data.package,     
				           "signType":"MD5",         //微信签名方
				           "paySign": res.data.data.sign //微信签名 
				        },
				        function(res){
				            if(res.err_msg == "get_brand_wcpay_request:ok" ) {
				           		that.$parent.show = false;
				            }else{
				            	that.alertshow = true;
				            	setTimeout(() => {
				            		that.alertshow = false;
				            	},1000)
				            }
				        }
				    );
				})
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			this.money = Store.getState().weixin.money;
			this.orderid = Store.getState().weixin.orderid;
		}
	}
</script>

<style>
</style>