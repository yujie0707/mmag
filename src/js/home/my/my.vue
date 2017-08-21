<template>
	<div id="my">
		<header class="my-header">
			<div @click="goEdit(info.avatar,info.mobile)">
				<img v-lazy="info.avatar" class="person-pic" />
				<span>{{info.mobile | mobile}}</span>
				<img src="/dist/image/home/my/bianij.png" />

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
	export default{
		data(){
			return {
				info:{}
			}
		},
		methods:{
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
			goEdit(img,phone){
				this.$router.push({
					name:"editmy",
					params:{
						img:img,
						phone:phone
					}
				})
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
		mounted(){
			axios({
				url:"/ec_shoppingcart/getnum",
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
				Store.dispatch({
					type:"NUM",
					context: res.data.data.carNum
				})
			})
			axios({
				url:"/user/getmyuserinfo",
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
				this.info = res.data.data.baseinfo;
			})
		},
		filters:{
			mobile:function(value){
				if(value){
					var arr = value.split("");
					for(var i = 0; i < 4; i++){
						arr[i+3] = "*";
					}
					return arr.join("");
					
				}else{
					return "";
				}
			}
		},
		activated(){
			axios({
				url:"/ec_shoppingcart/getnum",
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
				Store.dispatch({
					type:"NUM",
					context: res.data.data.carNum
				})
			})
			axios({
				url:"/user/getmyuserinfo",
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