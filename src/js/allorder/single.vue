<template>
	<div class="orderSingle">
		<p class="time">
			<img src="/dist/image/allorder/time.png" />
			<span>
				{{item.order_time}}
			</span>
			<span>
				{{item.status | status}}
			</span>
		</p>
		<div class="fruit" v-if="item.type == 1" @click="goDetail(item)">
			<img v-lazy="item.img" class="detail-img" />
			<div class="detail">
				<div class="title">
					<span>{{item.name}}</span>
					<span>{{item.mbn_details}}</span>
				</div>
				<div class="weight">
					<span>一件起售</span>
					<span>{{item.details}}</span>
				</div>
				<div class="send">
					<img src="/dist/image/home/subhome/send.png"/>
					<img src="/dist/image/home/subhome/all.png"/>
				</div>
				<div class="price">
					<span>￥{{item.fin_money}}/单</span>
				</div>
			</div>
		</div>
		<div class="pick" v-if="item.type == 2" @click="goDetail(item)">
			<img v-lazy="item.img" class="single-img"/>
			<div class="single-detail">
				<div class="title">{{item.name}}</div>
				<div class="address">
					<img src="/dist/image/order/position.png" />
					<span>{{item.address}}</span>
				</div>
				<div class="price">
					<span>￥{{item.fin_money}}/单</span>
				</div>
			</div>
		</div>
		<v-button :item="{status:item.status,type:item.type,orderid:item.orderid,finmoney:item.fin_money,ismark:item.ismark,catid:item.catid,img:item.img,item:item}"></v-button>
	</div>
</template>

<script>
	import Button from "./button.vue";
	export default{
		components:{
			"v-button":Button
		},
		props:{
			item:Object
		},
		filters:{
			status:function(val){
				val = parseInt(val);
				switch(val){
					case -1:
						return "订单失效";
					case 0:
						return "购物车中";
					case 1:
						return "待支付";
					case 2:
						return "待发货";
					case 3:
						return "待确认";
					case 4:
						return "退款中";
					case 5:
						return "交易成功";
					case 6:
						return "已退款";
					case 7:
						return "交易成功";
					case 8:
						return "审核未通过";
				}
			}
		},
		methods:{
			goDetail(item){
				this.$router.push({
					name:"orderdetail",
					params:{
						detail: JSON.stringify(item)
					}
				})
			}
		}
	}
</script>

<style>
</style>