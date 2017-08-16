<template>
	<div id="order-address">
		<div id="no" v-if="show" @click="addAddress()">
			+ 新增收货地址
		</div>
		<div id="yes" v-else @click="addAddress()">
			<div class="name">
				<span>收货人：{{address.name}}</span>
				<span v-if="address.default == 1" class="isdefault">默认</span>
				<span class="phone">{{address.phone}}</span>
			</div>
			<div class="address">
				收货地址：{{address.province + address.city + address.county + address.details}}
			</div>
		</div>
		<img src="/dist/image/order/border.png" style="width: 100%;display: block;"/>
		<ul>
			<li v-for="(item,index) in list">
				<router-link :to="{name:'detail',params:{id:item.catid}}">
					<img v-lazy="item.img" class="shopping-list-img" />
					<div class="shopping-list-detail">
						<p>{{item.names}} | {{item.mbn_details}}斤/件</p>
						<p>一件起售 {{item.details}}</p>
						<p>￥<span>{{(item.price * item.mbn_details).toFixed(2).toString().split(".")[0]}}.</span>{{(item.price * item.mbn_details).toFixed(2).toString().split(".")[1]}}</p>
					</div>
				</router-link>
				<div class="shopping-list-num">
					<span>X{{item.num}}</span>
				</div>
			</li>
		</ul>
		<div class="time">
			<img src="/dist/image/order/shijianbiao.png" /><span>配送时间</span><span>工作节假日均可收货</span>
		</div>
		<div class="coupon">
			<span>优惠券</span>
			<span>（可用0张）</span>
			<img src="/dist/image/home/my/quanbu.png"/>
		</div>
		<div class="grade">
			<span>积分</span>
			<span>（可用积分0）</span>
		</div>
		<div class="mustTotal">
			<span>商品应付</span>
			<span>￥{{total}}</span>
		</div>
		<div class="mustTotal" style="margin-bottom: 2.2rem;">
			<span>运费</span>
			<span>￥0.00</span>
		</div>
		<footer>
			<div>
				<span>合计：</span>
				<span>￥{{total}}</span>
			</div>
			<div>
				<span>
					付款：<a>￥{{total}}</a>
				</span>
				<span @click="submit()">提交订单</span>
			</div>
		</footer>
	</div>
</template>

<script>
	
	import Store from "../store/store.js";
	export default{
		
		methods:{
			addAddress(){
				sessionStorage.setItem("isjump",1);
				this.$router.push("/address");
			},
			submit(){
				if(Store.getState().order.type == 1){
					axios({
						url:"http://ws.tianmaoetong.com/order/add",
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
							addressid: this.address.addressid,
							couponid:'',
							integralid:'',
							totallmoney: this.total,
							finallymoney: this.total,
							freight:"0.00",
							ordertype: Store.getState().order.type,
							orderids: Store.getState().order.detail.orderids
						}
					}).then(res => {
						if(res.data.code == 0){
							Store.dispatch({
								type:"WEIXIN",
								context:{
									orderid: res.data.data.orderid,
									money: res.data.data.fin_money
								}
							})
							this.$router.push("/weixin")
						}
					})
					
				}else if(Store.getState().order.type == 2){
					axios({
						url:"http://ws.tianmaoetong.com/order/add",
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
							addressid: this.address.addressid,
							couponid:'',
							integralid:'',
							totallmoney: this.total,
							finallymoney: this.total,
							freight:"0.00",
							ordertype: Store.getState().order.type,
							catid:Store.getState().order.detail.list[0].catid,
							buy_num:Store.getState().order.detail.list[0].num
						}
					}).then(res => {
						if(res.data.code == 0){
							Store.dispatch({
								type:"WEIXIN",
								context:{
									orderid: res.data.data.orderid,
									money: res.data.data.fin_money
								}
							})
							this.$router.push("/weixin")
						}
					})
				}
			}
		},
		data(){
			return{
				show:false,
				address:{},
			    list: Store.getState().order.detail.list
			}
		},
		computed:{
			total(){
				var total = 0;
				for(var i = 0; i < this.list.length; i++){
					total += parseFloat(this.list[i].num) * parseFloat(this.list[i].mbn_details) * parseFloat(this.list[i].price);
				}
				return total.toFixed(2);
			}
		},
		mounted(){
			axios({
				url:"http://ws.tianmaoetong.com/address/search",
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
					isdefault:1
				}
			}).then(res => {
				this.address = res.data.data[0];
				this.show = res.data.data.length == 0 ? true : false;
			})
		},
		activated(){
			this.show = false;
			this.list = Store.getState().order.detail.list;
			
			if(this.$route.params.address){
				if(this.$route.params.address == "false"){
					axios({
						url:"http://ws.tianmaoetong.com/address/search",
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
							isdefault:1
						}
					}).then(res => {
						this.address = res.data.data[0];
						this.show = res.data.data.length == 0 ? true : false;
					})
				}else{
					this.address = JSON.parse(this.$route.params.address);
				}
			}else{
				axios({
					url:"http://ws.tianmaoetong.com/address/search",
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
						isdefault:1
					}
				}).then(res => {
					this.address = res.data.data[0];
					this.show = res.data.data.length == 0 ? true : false;
				})
			}
		}
	}
</script>

<style>
</style>