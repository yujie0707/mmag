<template>
	<div id="orderDetail">
		<v-header></v-header>
		<div class="status">
			<img src="/dist/image/orderdetail/photo.png" />
			<p>
				<span>{{detail.status | status}}</span>
				<span>购物愉快</span>
			</p>
			
		</div>
		<div id="yes" v-if="detail.type == 1">
			<div class="name">
				<span>收货人：{{detail.reName}}</span>
				<span class="phone">{{detail.rePhone}}</span>
			</div>
			<div class="address">
				收货地址：{{detail.reAddress}}
			</div>
		</div>
		<img src="/dist/image/order/border.png" style="width: 100%;display: block;" v-if="detail.type == 1"/>
		<div class="fruit" v-if="detail.type == 1">
			<img v-lazy="detail.img" class="detail-img" />
			<div class="detail">
				<div class="title">
					<span>{{detail.name}}</span>
					<span>{{detail.mbn_details}}</span>
				</div>
				<div class="weight">
					<span>一件起售</span>
					<span>{{detail.details}}</span>
				</div>
				<div class="send">
					<img src="/dist/image/home/subhome/send.png"/>
					<img src="/dist/image/home/subhome/all.png"/>
				</div>
				<div class="price">
					<span>￥{{(detail.fin_money / detail.buy_num).toFixed(2)}}</span>
					<span>X{{detail.buy_num}}</span>
				</div>
			</div>
		</div>
		<div class="pick" v-if="detail.type == 2">
			<img v-lazy="detail.img" class="single-img"/>
			<div class="single-detail">
				<div class="title">{{detail.name}}</div>
				<div class="address">
					<img src="/dist/image/order/position.png" />
					<span>{{detail.address}}</span>
				</div>
				<div class="price">
					<span>￥{{detail.fin_money}}</span>
				</div>
			</div>
		</div>
		<div class="finMoney">
			<p>
				<span>运费</span>
				<span>￥0.00</span>
			</p>
			<p>
				<span>积分</span>
				<span>0.00</span>
			</p>
			<p>￥{{detail.fin_money}}</p>
			<p>合计：<a>￥{{detail.fin_money}}</a></p>
		</div>
		<div class="orderid">
			<p>
				订单编号：{{detail.orderid}}
			</p>
			<p v-if="detail.pay_time != ''">
				付款时间：{{detail.pay_time}}
			</p>
			<p v-if="detail.push_time != ''">
				发货时间：{{detail.push_time}}
			</p>
		</div>
	</div>
</template>

<script>
	import Header from "./header.vue";
	import share from "../share/share.js";
	export default{
		components:{
			"v-header":Header
		},
		data(){
			return{
				detail:this.$route.params.detail
			}
		},
		mounted(){
			this.detail = JSON.parse(this.$route.params.detail);
		},
		activated(){
			this.detail = JSON.parse(this.$route.params.detail);
			share({});
			
		},
		filters:{
			status: function(val){
				val = parseInt(val);
				switch(val){
					case -1:
						return "订单失效";
					case 0:
						return "未提交该订单";
					case 1:
						return "请尽快付款";
					case 2:
						return "正在积极发送中";
					case 3:
						return "运输中，请耐心等待";
					case 4:
						return "退款中，请耐心等待";
					case 5:
						return "交易完成";
					case 6:
						return "退款成功";
					case 7:
						return "交易完成";
					case 8:
						return "退款未通过";
				}
			}
		}
	}
</script>

<style>
</style>