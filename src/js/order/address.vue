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
		<div class="coupon" @click="goCoupon()">
			<span>优惠券</span>
			<span v-if="couponShow">（可用{{couponNum}}张）</span>
			<span v-else style="float: right; color: #FF7916;">-￥{{couponMoney.toFixed(2)}}</span>
			<img v-if="couponShow" src="/dist/image/home/my/quanbu.png"/>
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
				<span>￥{{totalcoupon}}</span>
			</div>
			<div>
				<span>
					付款：<a>￥{{totalcoupon}}</a>
				</span>
				<span @click="submit()">提交订单</span>
			</div>
		</footer>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	
	import Store from "../store/store.js";
	import config from "../config/config.js";
	import Alert from "../alert.vue";
	export default{
		components:{
			"v-alert":Alert
		},
		methods:{
			goCoupon(){
				this.$router.push({
					name:"coupon",
					params:{
						type: 2,
						money: this.total
					}
				})
			},
			addAddress(){
				sessionStorage.setItem("isjump",1);
				this.$router.push("/address");
			},
			submit(){
				if(this.show){
					this.alertshow = true;
					this.context = "请添加地址";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
				}
				if(Store.getState().order.type == 1){
					axios.post("/order/add",{
						addressid: this.address.addressid,
						couponid: this.couponid,
						integralid:'',
						totallmoney: this.total,
						finallymoney: this.totalcoupon,
						freight:"0.00",
						ordertype: Store.getState().order.type,
						orderids: Store.getState().order.detail.orderids
					},config).then(res => {
						if(res.data.code == 0){
							Store.dispatch({
								type:"WEIXIN",
								context:{
									orderid: res.data.data.orderid,
									money: res.data.data.fin_money
								}
							})
							if(sessionStorage.getItem("coupon")){
								sessionStorage.removeItem("coupon");
								sessionStorage.removeItem("couponid");
							}
							this.$router.push("/weixin")
						}
					})
					
				}else if(Store.getState().order.type == 2){
					axios.post("/order/add",{
						addressid: this.address.addressid,
						couponid:this.couponid,
						integralid:'',
						totallmoney: this.total,
						finallymoney: this.totalcoupon,
						freight:"0.00",
						ordertype: Store.getState().order.type,
						catid:Store.getState().order.detail.list[0].catid,
						buy_num:Store.getState().order.detail.list[0].num
					},config).then(res => {
						if(res.data.code == 0){
							Store.dispatch({
								type:"WEIXIN",
								context:{
									orderid: res.data.data.orderid,
									money: res.data.data.fin_money
								}
							})
							if(sessionStorage.getItem("coupon")){
								sessionStorage.removeItem("coupon");
								sessionStorage.removeItem("couponid");
							}
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
			    list: Store.getState().order.detail.list,
			    couponNum:0,
			    couponShow:true,
			    couponMoney:0,
			    couponid:'',
			    alertshow:false,
			    context:""
			}
		},
		computed:{
			total(){
				var total = 0;
				for(var i = 0; i < this.list.length; i++){
					total += parseFloat(this.list[i].num) * parseFloat(this.list[i].mbn_details) * parseFloat(this.list[i].price);
				}
				return total.toFixed(2);
			},
			totalcoupon(){
				var total = 0;
				for(var i = 0; i < this.list.length; i++){
					total += parseFloat(this.list[i].num) * parseFloat(this.list[i].mbn_details) * parseFloat(this.list[i].price);
				}
				total = total - this.couponMoney;
				return total.toFixed(2);
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			this.show = false;
			this.list = Store.getState().order.detail.list;
			this.couponShow = sessionStorage.getItem("coupon") ? false : true;
			this.couponMoney = sessionStorage.getItem("coupon") ? parseFloat(sessionStorage.getItem("coupon")) : 0;
			this.couponid = sessionStorage.getItem("couponid") ? sessionStorage.getItem("couponid") : '';
			
			axios.post("/Coupon/GetList",{
				type:1,
				money: this.total
			},config).then(res => {
				this.couponNum = res.data.data.length;
			})
			if(this.$route.params.address){
				if(this.$route.params.address == "false"){
					axios.post("/address/search",{
						isdefault:1
					},config).then(res => {
						this.address = res.data.data[0];
						this.show = res.data.data.length == 0 ? true : false;
					})
				}else{
					this.address = JSON.parse(this.$route.params.address);
				}
			}else{
				axios.post("/address/search",{
					isdefault:1
				},config).then(res => {
					this.address = res.data.data[0];
					this.show = res.data.data.length == 0 ? true : false;
				})
			}
		}
	}
</script>

<style>
</style>