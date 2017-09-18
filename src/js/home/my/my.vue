<template>
	<div id="my">
		<header class="my-header">
			<div @click="goeditmy()">
				<img v-lazy="info.avatar" class="person-pic" />
				<span>{{info.mobile}}</span>
			</div>
		</header>
		<div class="coupon">
			<div class="coupon-left">
				<span>积分</span>
				<span>{{info.points}}</span>
				<span>去兑换<img src="/dist/image/home/my/duihuan.png"/></span>
			</div>
			<div class="coupon-right" @click="goCoupon()">
				<span>优惠券</span>
				<span>{{info.couponNum}}</span>
				<span>查看<img src="/dist/image/home/my/duihuan.png"/></span>
			</div>
		</div>
		<div class="order-detail">
			<div class="allOrder">
				<span>订单详情</span>
				<span @click="goAllOrder(0)">查看全部订单<img src="/dist/image/home/my/quanbu.png"/></span>
			</div>
			<div class="wiat">
				<span @click="goAllOrder(1)">
					<img src="/dist/image/home/my/daifukuan.png" />
					<span>待付款</span>
					<span class="num" v-if="info.waitPayNum > 0">{{info.waitPayNum}}</span>
				</span>
				<span @click="goAllOrder(2)">
					<img src="/dist/image/home/my/daifahuo-.png" />
					<span>待发货</span>
					<span class="num" v-if="info.waitPushNum > 0">{{info.waitPushNum}}</span>
				</span>
				<span @click="goAllOrder(3)">
					<img src="/dist/image/home/my/daifahuo.png" />
					<span>待收货</span>
					<span class="num" v-if="info.waitAcceptNum > 0">{{info.waitAcceptNum}}</span>
				</span>
				<span @click="goAllOrder(5)">
					<img src="/dist/image/home/my/tuikuan.png" />
					<span>待退款</span>
					<span class="num" v-if="info.waitBackMoneyNum > 0">{{info.waitBackMoneyNum}}</span>
				</span>
				<span @click="goCollect()">
					<img src="/dist/image/home/my/shoucang.png" />
					<span>我的收藏</span>
				</span>
				<span @click="goAddress()">
					<img src="/dist/image/home/my/shouhuo_weidian.png" />
					<span>收货地址</span>
				</span>
				<span>
					<a href="tel:4000011857">
						<img src="/dist/image/home/my/xiaoxia.png" />
						<span>客服电话</span>
					</a>
				</span>
				
			</div>
		</div>
	</div>
</template>

<script>
	import Store from "../../store/store.js";
	import config from "../../config/config.js";
 	export default{
		data(){
			return {
				info:{}
			}
		},
		methods:{
			goeditmy(){
				this.$router.push({
					name:"editmy",
					params:{
						head: this.info.avatar,
						name: this.info.mobile
					}
				})
			},
			goCollect(){
				this.$router.push("/collect");
			},
			goAllOrder(index){
				this.$router.push("/allorder");
				sessionStorage.setItem("index",index);
			},
			goAddress(){
				sessionStorage.setItem("isjump",0);
				this.$router.push("/address");
			},
			goCoupon(){
				this.$router.push({
					name:"coupon",
					params:{
						type:1,
						money:0
					}
				})
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/ec_shoppingcart/getnum",{},config).then(res => {
				if(res.data.code == 0){
					Store.dispatch({
						type:"NUM",
						context: res.data.data.carNum
					})
				}else if(res.data.code == 2000){
					Store.dispatch({
						type:"NUM",
						context: 0
					})
				}
			})
			axios.post("/user/getmyuserinfo",{},config).then(res => {
				this.info = res.data.data.baseinfo;
			})
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		}
	}
</script>

<style>
</style>