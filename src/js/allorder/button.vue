<template>
	<div class="bottom-button">
		<div v-if="item.status == 1">
			<button class="cancle" @click="cancel(item.orderid)">取消订单</button>
			<button class="payNow" @click="payNow(item.orderid,item.finmoney,item.item.goodStatus)">去支付</button>
		</div>
		<div v-if="item.status == 2">
			<button class="refund" @click="refund(item.orderid,item.type,item.finmoney,item.item)">申请退款</button>
			<button class="shipments" @click="shipments()">提醒发货</button>
		</div>
		<div v-if="item.status == 3">
			<button class="refund" @click="refund(item.orderid,item.type,item.finmoney,item.item)">申请退款</button>
			
			<button class="affirm" @click="affirm(item.orderid,item.type)" v-if="item.type == 1">确认收货</button>
			<button class="affirm" @click="affirm(item.orderid,item.type)" v-else>确认入园</button>
		</div>
		<div v-if="item.status == 5">
			<button class="talking" v-if="item.ismark == 2" @click="gotalk(item.catid,item.img,item.orderid)">立即评价</button>
			<button class="talked" v-else>已评价</button>
		</div>
		<div v-if="item.status == 7">
			<button class="talking" v-if="item.ismark == 2" @click="gotalk(item.catid,item.img,item.orderid)">立即评价</button>
			<button class="talked" v-else>已评价</button>
		</div>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import Store from "../store/store.js";
	import Alert from "../alert.vue";
	import config from "../config/config.js";
	export default{
		components:{
			"v-alert":Alert
		},
		data(){
			return {
				context:"退款审核中",
				alertshow:false
			}
		},
		props:{
			item:Object
		},
		methods:{
			cancel(orderid){
				axios.post("/order/cancle",{
					orderid:orderid
				},config).then(res => {
					if(res.data.code == 0){
						this.context = "取消成功";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)

						axios.post("/order/search",{
							type: 1,
							page: 1
						},config).then(res => {
							if(res.data.code == 0){
								Store.dispatch({
									type:"PAY",
									context: res.data.data
								})
							}
						})
						axios.post("/order/search",{
							type: 6,
							page: 1
						},config).then(res => {
							if(res.data.code == 0){
								Store.dispatch({
									type:"ALL",
									context: res.data.data
								})
							}
						})
					}
				})
			},
			payNow(orderid,money,goodStatus){
				if(goodStatus == 2){
					this.context = "该商品已下架";
					this.alertshow = true;
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				Store.dispatch({
					type:"WEIXIN",
					context:{
						orderid: orderid,
						money: money
					}
				})
				this.$router.push("/weixin")
			},
			refund(orderid,type,money,item){
				
				if(type == 1){
					this.$router.push({
						name:"refund",
						params:{
							data: JSON.stringify(item)
						}
					})
				}else{
					if(confirm("你确定退款吗?")){
						axios.post("/ec_pay/backmoney",{
							orderid:orderid,
							type:3
						},config).then(res => {
							if(res.data.code == 0){
								this.context = "退款审核中";
								this.alertshow = true;
								setTimeout(() => {
									this.alertshow = false;
								},1000)
								axios.post("/order/search",{
									type: 6,
									page: 1
								},config).then(res => {
									if(res.data.code == 0){
										Store.dispatch({
											type:"ALL",
											context: res.data.data
										})
									}
								})
								axios.post("/order/search",{
									type: 4,
									page: 1
								},config).then(res => {
									if(res.data.code == 0){
										Store.dispatch({
											type:"REFUND",
											context: res.data.data
										})
									}
								})
								axios.post("/order/search",{
									type: 2,
									page: 1
								},config).then(res => {
									if(res.data.code == 0){
										Store.dispatch({
											type:"SEND",
											context: res.data.data
										})
									}
								})
								axios.post("/order/search",{
									type: 3,
									page: 1
								},config).then(res => {
									if(res.data.code == 0){
										Store.dispatch({
											type:"YES",
											context: res.data.data
										})
									}
								})
							}
						})
						
					}
				}
			},
			shipments(){
				this.context = "司机正在路上";
				this.alertshow = true;
				setTimeout(() => {
					this.alertshow = false;
				},1000)
			},
			affirm(orderid,type){
				type = type == 1 ? 1 : 3;
				axios.post("/orderhandle/sure",{
					orderid:orderid,
					type: type
				},config).then(res => {

					if(res.data.code == 0){
						
						axios.post("/order/search",{
							type: 6,
							page: 1
						},config).then(res => {
							if(res.data.code == 0){
								Store.dispatch({
									type:"ALL",
									context: res.data.data
								})
							}
						})
						axios.post("/order/search",{
							type: 3,
							page: 1
						},config).then(res => {
							if(res.data.code == 0){
								Store.dispatch({
									type:"YES",
									context: res.data.data
								})
							}
						})
						axios.post("/order/search",{
							type: 5,
							page: 1
						},config).then(res => {
							if(res.data.code == 0){
								Store.dispatch({
									type:"COMPLETE",
									context: res.data.data
								})
							}
						})
						this.context = "已确认";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}
				})
			},
			gotalk(catid,img,orderid){
				this.$router.push({
					name:"talkingnow",
					params:{
						orderid:orderid,
						catid:catid,
						img:img
					}
				})
			}
		}
	}
</script>

<style>
</style>