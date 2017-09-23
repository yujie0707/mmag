<template>
	<div id="bargain">
		<div class="top">
			<img src="/dist/image/bargain/backgroundtop@2x.png" />
			<div class="rule" @click="showActivity()">
				活动说明
			</div>
		</div>
		<ul class="list">
			<li v-for="item in list" >
				<img v-lazy="item.proImg" class="img" />
				<div class="detail-wrap">
					<p>{{item.proName}}</p>
					<p>{{item.taxDetails}}</p>
					<p>原价：￥<span>{{item.price}}</span></p>
					<p v-if="item.status == 3" @click="goHelp(item.id)"><span>发起砍价</span></p>
					<p v-else-if="item.status == 1" @click="goHelp(item.id)"><span>砍价中...</span></p>
					<p v-else><span>已付款</span></p>
				</div>
			</li>
		</ul>
		<img src="/dist/image/bargain/bottom.png" class="bottom" />
		<div class="activity-wrap" v-if="show" :style="{height:height + 'px'}">
			<div class="detail">
				<h3>活动说明</h3>
				<div>
					<p>1.一个商品只可购买一次</p>
					<p>2.一个微信号首次可砍0.6~1.5元，其后每次只能砍0.2元</p>
					<p>3.该活动不可与其他优惠活动同时使用（如优惠券)</p>
					<p>4.下单后去妈妈爱果微信公众号里的微商城查看订单</p>
				</div>
				<button @click="hide()">我知道了</button>
			</div>
		</div>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import config from "../config/config.js";
	import Alert from "../alert.vue";
	export default{
		components:{
			"v-alert":Alert
		},
		data(){
			return {
				show:false,
				alertshow:false,
				context:"",
				height:0,
				list:[{
		            "id": "91068f773d1f3126413f67ea8f",
		            "proName": "泰国香水椰青",
		            "singleDetails": "约500g/个",
		            "taxDetails": "1公斤/件",
		            "price": 21.6,
		            "proImg": "http://api.tianmaoetong.com:7777/img/category/201709151ql505r48k66L42G4sb3.jpg",
		            "leastNum": "10000",
		            "goodStatus": 3,
		            "status": 3,
		            "shareid": "NULL"
		        }]
			}
		},
		methods:{
			showActivity(){
				this.show = true;
			},
			hide(){
				this.show = false;
			},
			
			goHelp(id){
				axios.post("/activity/PushCut",{
					catid:id
				},config).then(res => {
					if(res.data.code == 0){
						sessionStorage.setItem("shareid",res.data.data.shareid);
						this.$router.push("/help");
					}else{
						this.alertshow = true;
						this.context = "发起失败，请重新尝试";
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}
				})
				
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			this.height = document.body.offsetHeight;
			
			axios.post("/activity/CutMoney",{},config).then(res => {
				if(res.data.code == 0){
					this.list = res.data.data;
				}
			})
		}
		
	}
</script>

<style>
</style>