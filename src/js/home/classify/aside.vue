<template>
	<div id="classify-aside">
		<ul class="classify-aside">
			<li class="classify-aside-single" :class="cur == index ? 'active' : ''" v-for="(item,index) in asideList" @click="tab(item.catid,index,item.name)">
				<span>{{item.name}}</span>
			</li>
			<img src="/dist/image/home/classify/quanbu.png" :style="{top : top + 'rem'}"/>
		</ul>
		<div class="title">{{title}}({{num}})</div>
		<ul class="classify-article">
			
			<li class="article-single" v-for="item in productList">
				<a @click="jump(item.catid)">
					<img v-lazy="item.imgUrl" class="article-single-img" />
					<div class="article-single-detail">
						<div class="article-single-detail-title">
							{{item.proName}} {{item.mbn_details}}
						</div>
						<div class="article-single-detail-sale">
							一件起售 {{item.detail}}
						</div>
						<img :src="'/dist/image/home/subhome/' + item.level + '.png'" />
						<div class="article-single-detail-price">
							￥<b>{{item.price.split(".")[0]}}.</b>{{item.price.split(".")[1]}}/斤
						</div>
					</div>
				</a>
				<div class="car-wrap" @click.stop.prevent="addCar(item.catid)" >
					<img src="/dist/image/home/shopping/jiahao.png" class="addCar" />
				</div>
			</li>
		</ul>
		<v-alert v-if="alertshow" context="添加成功"></v-alert>
	</div>
</template>

<script>
	import Store from "../../store/store.js";
	import Alert from "../../alert.vue";
	export default{
		components:{
			"v-alert":Alert
		},
		data(){
			return {
				asideList:[],
				cur:0,
				top:0,
				title:"全部商品",
				num:0,
				productList:[],
				alertshow:false
				
			}
		},
		methods:{
			tab(id,index,name){
				
				this.cur = index;
				this.top = 1 * index;
				this.title = name;
				axios({
					url:"http://ws.tianmaoetong.com/ec_category/category",
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
						catid:id,
						updateTime: ''
					}
				}).then(res => {
					console.log(res);
					if(res.data.code == 0){
						this.productList = res.data.data;
						
						this.num = res.data.data.length;
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
					if(res.data.code == 0){
						Store.dispatch({
							type:"NUM",
							context: res.data.data.carNum
						})
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}
				})
			},
			jump(id){
				this.$router.push("/detail/"+id);
			}
		},
		mounted(){
			axios({
				url:"http://ws.tianmaoetong.com/ec_category/list",
				method:"post",
				headers:{
					"appid": 1,
			        "deviceid": "985ff090eb761e8329c64092ac421adf9afe3",
			        "channelid": "WX",
			        "UserAgent": "WX",
			        "productid": 1,
			        "userid":sessionStorage.getItem("userid"),
			        "usertoken":sessionStorage.getItem("usertoken")
				}
			}).then(res => {
				console.log(res);
				if(res.data.code == 0){
					this.asideList = res.data.data;
					
				}
			})
			axios({
					url:"http://ws.tianmaoetong.com/ec_category/category",
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
						catid:1,
						updateTime: ''
					}
				}).then(res => {
					console.log(res);
					if(res.data.code == 0){
						this.productList = res.data.data;
						this.num = res.data.data.length;
					}
				})
		}
	}
</script>

<style>
</style>