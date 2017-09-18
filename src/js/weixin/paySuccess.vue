<template>
	<div id="paySuccess">
		<div id="order-header">
			<img src="/dist/image/search/return.png" @click="goback()" />
			<span>支付成功</span>
			<span @click="gohome()">完成</span>
		</div>
		<div class="background">
			<img src="/dist/image/weixin/zhifuchenggong.png" />
			<span>订单支付成功</span>
		</div>
		<div class="words">
			卖家已付款，您的包裹已蓄势待发~
		</div>
		<div class="orderid">
			<span>订单编号：{{orderid}}</span>
			<span>付款时间：{{time}} {{time1}}</span>
		</div>
		
		<div class="menu">
			<button @click="goAllorder()">查看订单</button>
			<button @click="gohome()">回到首页</button>
		</div>
	</div>
</template>

<script>
	import Store from "../store/store.js";
	export default{
		methods:{
			goback(){
				this.$router.go(-1);
			},
			gohome(){
				this.$router.push("/home");
			},
			goAllorder(){
				this.$router.push("/allorder");
				sessionStorage.setItem("index",2);
			}
		},
		data(){
			return{
				time:"",
				time1:"",
				orderid:""
			}
		},
		activated(){
			var time = new Date();
			var arr = [];
			arr.push(time.getFullYear());
			arr.push(time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth());
			arr.push(time.getDate() < 10 ? "0" + time.getDate() : time.getDate());
			var arr1 = [];
			arr1.push(time.getHours() < 10 ? "0" + time.getHours() : time.getHours());
			arr1.push(time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
			arr1.push(time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds());
			this.time = arr.join("-");
			this.time1 = arr1.join(":");
			this.orderid = Store.getState().weixin.orderid;
		}
	}
</script>

<style>
</style>