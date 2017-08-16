<template>
	<div id="all" :style="{height:height + 'px'}" @scroll="scroll($el)">
		<div class="all-wrap">
			<v-empty v-if="show"></v-empty>
			<v-single v-for="item in list" :item="item"></v-single>
		</div>
		
		<div class="loading" v-if="isLoading">
			<img src="/dist/image/home/subhome/loading.gif"/>
			加载中
		</div>
		<span class="toBottomOfPage" v-if="isShow">没有订单了</span>
	</div>
</template>

<script>
	import Store from "../store/store.js";
	import Empty from "../home/shopping/body-empty.vue";
	import Single from "./single.vue";
	export default{
		components:{
			"v-empty":Empty,
			"v-single":Single
		},
		props:{
			type:String,
			height:Number
		},
		data(){
			return{
				show:true,
				list:[],
				isLoading: false,
				isShow: false,
				lock: true,
				page:1
			}
		},
		methods:{
			scroll(el){
				var that = this;
				if(this.lock){
					if(this.height + el.scrollTop >= el.children[0].offsetHeight){
						this.lock = false;
						this.isLoading = true;
						var page = that.page;
						page++;
						that.page = page;
						axios({
							url:"http://ws.tianmaoetong.com/order/search",
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
								type: this.type,
								page: this.page
							}
						}).then(res => {
							if(res.data.code == 0){
								var arr = this.list;
								this.list = arr.concat(res.data.data);
								this.isShow = res.data.data.length < 20 ? true : false;
								this.isLoading = false;
								this.lock = res.data.data.length < 20 ? false : true;
							}
						})
					}
				}
			}
		},
		mounted(){
			axios({
				url:"http://ws.tianmaoetong.com/order/search",
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
					type: this.type,
					page: 1
				}
			}).then(res => {
				if(res.data.code == 0){
					this.list = res.data.data;
					this.show = res.data.data.length == 0 ? true : false;
					this.lock = res.data.data.length < 20 ? false : true;
				}
			})
		},
		activated(){
			this.page = 1;
			switch(this.type){
				case "1":
					Store.subscribe(() => {
						this.list = Store.getState().pay;
						this.show = this.list.length == 0 ? true : false;
						this.lock = this.list.length < 20 ? false : true;
					})
					break;
				case "2":
					Store.subscribe(() => {
						this.list = Store.getState().send;
						this.show = this.list.length == 0 ? true : false;
						this.lock = this.list.length < 20 ? false : true;
					})
					break;
				case "3":
					Store.subscribe(() => {
						this.list = Store.getState().yes;
						this.show = this.list.length == 0 ? true : false;
						this.lock = this.list.length < 20 ? false : true;
					})
					break;
				case "4":
					Store.subscribe(() => {
						this.list = Store.getState().refund;
						this.show = this.list.length == 0 ? true : false;
						this.lock = this.list.length < 20 ? false : true;
					})
					break;
				case "5":
					Store.subscribe(() => {
						this.list = Store.getState().complete;
						this.show = this.list.length == 0 ? true : false;
						this.lock = this.list.length < 20 ? false : true;
					})
					break;
				case "6":
					Store.subscribe(() => {
						this.list = Store.getState().all;
						this.show = this.list.length == 0 ? true : false;
						this.lock = this.list.length < 20 ? false : true;
					})
					break;
			}
			axios({
				url:"http://ws.tianmaoetong.com/order/search",
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
					type: this.type,
					page: 1
				}
			}).then(res => {
				if(res.data.code == 0){
					switch(this.type){
						case "1":
							Store.dispatch({
								type:"PAY",
								context: res.data.data
							})
							break;
						case "2":
							Store.dispatch({
								type:"SEND",
								context: res.data.data
							})
							break;
						case "3":
							Store.dispatch({
								type:"YES",
								context: res.data.data
							})
							break;
						case "4":
							Store.dispatch({
								type:"REFUND",
								context: res.data.data
							})
							break;
						case "5":
							Store.dispatch({
								type:"COMPLETE",
								context: res.data.data
							})
							break;
						case "6":
							Store.dispatch({
								type:"ALL",
								context: res.data.data
							})
							break;
					}
				}
			})
		}
	}
</script>

<style>
</style>