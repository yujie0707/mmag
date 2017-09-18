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
					<span>￥<b>{{data.money.split(".")[0]}}</b>.<u>{{data.money.split(".")[1]}}</u>{{data.mbn_detailsType | type}}</span>
					<span>商超价/<s>￥{{data.shop_money}}</s></span>
				</div>
			</div>
		</a>
		<div class="car-wrap" @click.stop.prevent="addCar(data.catid)" >
			<img src="/dist/image/home/subhome/gouwuche_red.png" class="single-car" />
		</div>
		<span class="single-num">
			已售{{data.buyNum}}
		</span>
		<v-alert v-if="alertshow" context="添加购物车成功"></v-alert>
	</div>
</template>

<script>
	import Store from "../../store/store.js";
	import Alert from "../../alert.vue";
	import config from "../../config/config.js";
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
		filters:{
			type(val){
				return val == 1 ? "/斤" : "/个";
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

				config.headers.userid = sessionStorage.getItem("userid");
				config.headers.usertoken = sessionStorage.getItem("usertoken");
				axios.post("/ec_shoppingcart/add",{
					catid:id
				},config).then(res => {
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