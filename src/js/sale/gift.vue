<template>
	<div id="gift">
		<img src="/dist/image/gift/theme.png" class="theme" />
		<ul class="list">
			<li v-for="(item,index) in list">
				<div class="img-wrap" @click="godetail(item.id)">
					<img v-lazy="item.proImg" />
					<span>剩余{{item.leastNum}}件</span>
				</div>
				<div class="detail-wrap" @click="godetail(item.id)">
					<p>
						<span>{{item.proName}}</span>
						<span>{{item.taxDetails}}</span>
					</p>
					<p>
						<span>{{item.tag}}</span>
					</p>
					<p>
						中秋特价：￥{{item.price}}
					</p>

				</div>
				<img src="/dist/image/gift/addshop.png" class="addshop" @click="add(item.id)" />
			</li>
		</ul>
		<div class="shop-wrap">
			<img src="/dist/image/gift/goshopping.png" @click="goshopping()" class="goshopping" />
			<span v-if="carNum > 0">{{carNum}}</span>
		</div>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import Alert from "../alert.vue";
	import config from "../config/config.js";
	export default{
		components:{
			"v-alert":Alert
		},
		data(){
			return {
				carNum:0,
				alertshow:false,
				context:"",
				list:[]
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/activity/Gift",{},config).then(res => {
				if(res.data.code == 0){
					this.list = res.data.data;
				}
			})
			axios.post("/ec_shoppingcart/getnum",{},config).then(res => {
				if(res.data.code == 0){
					this.carNum = res.data.data.carNum;
				}
			})
		},
		methods:{
			add(id){
				axios.post("/ec_shoppingcart/add",{
					catid: id
				},config).then(res => {
					if(res.data.code == 0){
						this.context = "添加购物车成功";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
						this.carNum = res.data.data.carNum;
					}
				})
			},
			goshopping(){
				this.$router.push("/home/shopping");
			},
			godetail(id){
				this.$router.push({
					name:"detail",
					params:{
						id:id
					}
				})
			}
		}
	}
</script>

<style>
	
	
</style>