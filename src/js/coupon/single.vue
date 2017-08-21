<template>
	<div class="coupon-single" @click="goOrder()">
		<img class="background" :src="data.status == 1 ? '/dist/image/coupon/youhuiquan-.png' : '/dist/image/coupon/youhuiquan-_bksy.png'" />
		<div class="value">
			<span>￥<a>{{data.couponMoney}}</a></span>
			<span>满{{data.couponIf}}元可用</span>
		</div>
		<div class="type">
			<span>{{data.openType}}</span>
			<span>{{data.eTime}}</span>
		</div>
		<img src="/dist/image/coupon/guoqi.png" v-if="data.status == 2 ? true : false" class="overdue"/>
	</div>
</template>

<script>
	export default{
		props:{
			data:Object
		},
		methods:{
			goOrder(){
				if(this.$route.params.type == 1){
					return;
				}else if(this.$route.params.type == 2){
					this.$router.go(-1);
					sessionStorage.setItem("coupon",this.data.couponMoney);
					sessionStorage.setItem("couponid",this.data.id);
				}
			}
		}
	}
</script>

<style>
</style>