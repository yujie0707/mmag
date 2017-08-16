<template>
	<div id="hot-single">
		<a @click="goDetail(data.catid)">
			<img v-lazy="data.img" class="single-img" />
			<div class="single-detail">
				<div class="title">
					<span>{{data.name}}</span>
					<span>{{data.mbn_details}}</span>
				</div>
				<div class="weight">
					<span>一件起售</span>
					<span>{{data.details}}</span>
				</div>
				<div class="send">
					<img src="/dist/image/home/subhome/send.png"/>
					<img src="/dist/image/home/subhome/all.png"/>
					<img :src="'/dist/image/home/subhome/' + data.level + '.png'" />
				</div>
				<div class="price">
					<span>￥<b>{{data.money.split(".")[0]}}</b>.<u>{{data.money.split(".")[1]}}</u>/斤</span>
					<span>商超价/<s>￥{{data.shop_money}}</s></span>
				</div>
			</div>
		</a>
		<div class="car-wrap" @click.stop.prevent="addCar(data.catid)" >
			<img src="/dist/image/home/subhome/gouwuche_red.png" class="single-car" />
		</div>
		<!--<span class="single-num">
			{{data.buyNum}}
		</span>-->
		<v-alert v-if="alertshow" context="添加购物车成功"></v-alert>
	</div>
</template>

<script>
	import Store from "../../store/store.js";
	import Alert from "../../alert.vue";
	export default{
		components:{
			"v-alert":Alert
		},
		props:{
			data:Object
		},
		data(){
			return{
				alertshow:false
			}
		},
		methods:{
			goDetail(id){
				this.$router.push({
					name:"detail",
					params:{
						id:id
					}
				})
			},
			addCar(id){
				axios({
					url:"http://ws.tianmaoetong.com/ec_shoppingcart/add",
					method:"post",
					headers:{
						"appid": 1,
				        "deviceid": "985ff090eb761e8329c64092ac421adf9afe3",
				        "channelid": "WX",
				        "UserAgent": "WX",
				        "productid": 1,
				        "userid":sessionStorage.getItem("userid"),
				        "usertoken":sessionStorage.getItem("usertoken")
					},
					params:{
						catid:id
					}
				}).then(res => {
					console.log(res);
					if(res.data.code == 0){
						Store.dispatch({
							type:"NUM",
							context:res.data.data.carNum
						})
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}
				})
			}
		}
	}
</script>

<style>
</style>