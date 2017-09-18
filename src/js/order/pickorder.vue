<template>
	<div id="pickorder">
		<v-header></v-header>
		<div id="after">
			支付成功后请凭订单号入园
			<img src="/dist/image/order/border.png" style="width: 100%;display: block;"/>
		</div>
		<div class="single" v-for="item in list">
			<img v-lazy="item.img" class="single-img"/>
			<div class="single-detail">
				<span class="title">{{item.name}}</span>
				<div class="address">
					<img src="/dist/image/order/position.png" />
					<span>{{item.address}}</span>
				</div>
				<div class="price">
					<span>￥<a>{{parseFloat(item.price).toFixed(2).toString().split(".")[0]}}.</a>{{parseFloat(item.price).toFixed(2).toString().split(".")[1]}}</span>
					<span>{{item.type}}X{{item.num}}</span>
				</div>
			</div>
		</div>
		<div class="time" @click="show()">
			<span>入园时间（{{timeGo}}）</span><img src="/dist/image/order/shijianbiao.png" />
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
		<div id="city" v-if="isshow" :style="{height:height + 'px'}">
			<div id="bottom">
				<header>
					<span class="cancle" @click="miss()">取消</span>
					<span class="city-choose">日期选择</span>
					<span class="back" @click="backto()">{{back}}</span>
				</header>
				<ul class="city" v-if="showcity == 0">
					<li v-for="item in yearlist" @click="tomonth(item)">{{item}}年</li>
				</ul>
				
				<ul v-else-if="showcity == 1">
					<li v-for="item in monthlist" @click="today(item)">{{item}}月</li>
				</ul>
				<ul v-else>
					<li v-for="item in daylist" @click="day(item)">{{item}}日</li>
				</ul>
			</div>
		</div>
		<v-alert v-if="alertshow" context="请选择入院时间"></v-alert>
	</div>
	
</template>

<script>
	import Store from "../store/store.js";
	import Header from "./header.vue";
	import Alert from "../alert.vue";
	import config from "../config/config.js";
	export default{
		components:{
			"v-header":Header,
			"v-alert":Alert
		},
		data(){
			return{
				list: this.$route.params.list,
				yearlist:[],
				monthlist:[],
				daylist:[],
				isshow:false,
				height: document.body.offsetHeight,
				showcity:0,
				back:"",
				time: this.$route.params.time,
				timeArr:[],
				timeStart: [],
				timeEnd: [],
				timeGo:"请选择",
				alertshow: false
			}
		},
		computed:{
			total(){
				var total = 0;
				for(var i = 0; i < this.list.length; i++){
					total += this.list[i].num * parseFloat(this.list[i].price);
				}
				return total.toFixed(1);
			}
		},
		methods:{
			submit(){
				if(this.timeGo == "请选择"){
					this.alertshow = true;
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				axios.post("/order/addcg",{
					catid: this.$route.params.catid,
	                couponid: "",
	                integralid: "",
	                totalmoney: this.total,
	                finMoney: this.total,
	                enterTime: this.timeGo,
	                adultNum:this.$route.params.adultNum,
	                childNum:this.$route.params.childNum,
	                teamNum:this.$route.params.teamNum
				},config).then(res => {
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
			},
			backto(){
				if(this.back == ""){
					return;
				}else{
					var temp = this.showcity;
					temp--;
					this.showcity = temp;
				}
			},
			show(){
				this.isshow = true;
			},
			miss(){
				this.isshow = false;
				this.showcity = 0;
			},
			tomonth(year){
				if(year == this.timeStart[0]){
					var arr = [];
					if(year == this.timeEnd[0]){
						for(var i = 0; i < this.timeEnd[1]-this.timeStart[1] + 1; i++){
							arr.push(i + parseInt(this.timeStart[1]));
						}
					}else{
						for(var i = 0; i < 12 - this.timeStart[1] + 1; i++){
							arr.push(i + parseInt(this.timeStart[1]));
						}
					}
					this.monthlist = arr;
				}else if(year == this.timeEnd[0]){
					var arr = [];
					for(var i = 0; i < parseInt(this.timeEnd[1]); i++){
						arr.push(i + 1);
					}
					this.monthlist = arr;
				}else{
					this.monthlist = [1,2,3,4,5,6,7,8,9,10,11,12]
				}
				this.showcity = 1;
				this.timeArr[0] = year;
				console.log(this.timeArr)
			},
			today(month){
				var max = 0;
				switch(month){
					case 2:
						if((this.timeArr[0]%4 == 0 && this.timeArr[0]%100 != 0) || this.timeArr[0]%400 == 0){
							max = 29;
						}else{
							max = 28;
						}
						break;
					case 4,6,9,11:
						max = 30;
						break;
					default:
						max = 31;
						break;
				}
				if(this.timeArr[0] == this.timeStart[0] && month == this.timeStart[1]){
					if(this.timeArr[0] == this.timeEnd[0] && month == this.timeEnd[1]){
						var arr = [];
						for(var i = 0; i < this.timeEnd[2]-this.timeStart[2] + 1; i++){
							arr.push(i + parseInt(this.timeStart[2]));
						}
						this.daylist = arr;
					}else{
						var arr = [];
						for(var i = 0; i < max-this.timeStart[2] + 1; i++){
							arr.push(i + parseInt(this.timeStart[2]));
						}
						this.daylist = arr;
					}
				}else if(this.timeArr[0] == this.timeEnd[0] && month == this.timeEnd[1]){
					var arr = [];
					for(var i = 0; i < this.timeEnd[2]; i++){
						arr.push(i + 1);
					}
					this.daylist = arr;
				}else{
					var arr = [];
					for(var i = 0; i < max; i++){
						arr.push(i + 1);
					}
					this.daylist = arr;
				}
				this.showcity = 2;
				this.timeArr[1] = month;
				console.log(this.daylist)
			},
			day(day){
				this.timeArr[2] = day;
				this.showcity = 0;
				this.isshow = false;
				var arr = this.timeArr;
				for(var i = 0; i < arr.length; i++){
					arr[i] = arr[i] < 10 ? "0" + arr[i] : arr[i];
				}
				this.timeGo = arr.join("-");
			}
		},
		mounted(){
			var time = this.time;
			this.timeStart = time.split("-----")[0].split("-");
			this.timeEnd = time.split("-----")[1].split("-");
			var arr = [];
			for(var i = 0; i < this.timeEnd[0]-this.timeStart[0] + 1; i++){
				arr.push(i + parseInt(this.timeStart[0]));
			}
			this.yearlist = arr;
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			
			var time = this.$route.params.time;
			this.timeStart = time.split("-----")[0].split("-");
			this.timeEnd = time.split("-----")[1].split("-");
			var arr = [];
			for(var i = 0; i < this.timeEnd[0]-this.timeStart[0] + 1; i++){
				arr.push(i + parseInt(this.timeStart[0]));
			}
			this.yearlist = arr;
			this.list = this.$route.params.list;
			this.time = this.$route.params.time;
			this.timeGo = "请选择";
			wx.hideOptionMenu();
		},
		watch:{
			"showcity":function(){
				if(this.showcity == 0){
					this.back = "";
				}else{
					this.back = "上一级";
				}
			}
		},
		beforeRouteEnter(to,from,next){
			if(localStorage.getItem("info")){
				if(JSON.parse(localStorage.getItem("info")).time < new Date().getTime()){
					localStorage.removeItem("info");
					sessionStorage.removeItem("userid");
					sessionStorage.removeItem("usertoken");
					next(vm => {
						vm.$router.push("/");
					});
				}else{
					var time = new Date();
					time = time.getTime() + 3*24*60*60*1000;
					var obj = JSON.parse(localStorage.getItem("info"));
					obj.time = time;
					localStorage.setItem("info",JSON.stringify(obj));
					sessionStorage.setItem("userid",JSON.parse(localStorage.getItem("info")).userid);
					sessionStorage.setItem("usertoken",JSON.parse(localStorage.getItem("info")).usertoken);
					next();
				}
			}else{
				next(vm => {
					vm.$router.push("/");
				});
			}
		}
	}
	
</script>

<style>
</style>