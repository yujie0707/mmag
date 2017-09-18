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
							￥<b>{{item.price.split(".")[0]}}.</b>{{item.price.split(".")[1]}}{{item.mbn_detailsType | type}}
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
	import config from "../../config/config.js";
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
		filters:{
			type(val){
				return val == 1 ? "/斤" : "/个";
			}
		},
		methods:{
			tab(id,index,name){
				
				this.cur = index;
				this.top = 1 * index;
				this.title = name;
				axios.post("/ec_category/category",{
					catid: id,
					updateTime: ''
				},config).then(res => {
					if(res.data.code == 0){
						this.productList = res.data.data;
						this.num = res.data.data.length;
					}else if(res.data.code == 356){
						this.productList = [];
						this.num = 0;
					}
				})
			},
			addCar(id){

				axios.post("/ec_shoppingcart/add",{
					catid:id
				},config).then(res => {
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
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/ec_category/list",{},config).then(res => {
				if(res.data.code == 0){
					this.asideList = res.data.data;
				}
			})
			axios.post("/ec_category/category",{
				catid:1,
				updateTime: ''
			},config).then(res => {
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