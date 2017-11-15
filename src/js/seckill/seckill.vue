<template>
	<div id="seckill">
		<header class="seckill-header">
			<span :class="show ? 'active' : ''" @click="tag(1)">今日秒杀</span>
			<span :class="!show ? 'active' : ''" @click="tag(2)">明日预告</span>
		</header>
		<div style="height: .1rem;background: #F3F3F3;"></div>
		<section class="seckill-main" v-if="show">
			<div class="time" v-if="killStatus == 1">
				<p>6:00开始抢购</p>
				<p>距开始<span>{{hour1 < 10 ? "0" + hour1 : hour1}}</span>:<span>{{min1 < 10 ? "0" + min1 : min1}}</span>:<span>{{sec1 < 10 ? "0" + sec1 : sec1}}</span></p>
				<p>秒杀宝贝请24小时内付款</p>
				<p>超过24小时宝贝价格将随市场价变化</p>
			</div>
			
			<div class="time" v-if="killStatus == 2">
				<p>好货已开抢</p>
				<p>距结束<span>{{hour2 < 10 ? "0" + hour2 : hour2}}</span>:<span>{{min2 < 10 ? "0" + min2 : min2}}</span>:<span>{{sec2 < 10 ? "0" + sec2 : sec2}}</span></p>
				<p>秒杀宝贝请24小时内付款</p>
				<p>超过24小时宝贝价格将随市场价变化</p>
			</div>
			
			<div class="time" v-if="killStatus == 3">
				<p>抢购已结束</p>
				<p>距下次开抢<span>{{hour3 < 10 ? "0" + hour3 : hour3}}</span>:<span>{{min3 < 10 ? "0" + min3 : min3}}</span>:<span>{{sec3 < 10 ? "0" + sec3 : sec3}}</span></p>
				<p>秒杀宝贝请24小时内付款</p>
				<p>超过24小时宝贝价格将随市场价变化</p>
			</div>
			
			<div class="single" v-for="item in today">
				<img v-lazy="item.img" class="single-img" />
				<div class="single-detail">
					<p>{{item.name}} {{item.mbn_details}}</p>
					<p>一件起售 {{item.details}}</p>
					<p v-if="killStatus == 1" class="rightNow">
						今日发放{{item.leastNum}}件
					</p>
					<p v-if="killStatus == 2" class="now">
						<span><a>已抢{{item.buyNum}}件</a><a>{{item.schedule}}%</a><a :style="{width:item.schedule/100 * 2.5 +'rem'}"></a></span>剩余{{item.leastNum}}件
					</p>
					<p v-if="killStatus == 3" class="now">
						<span><a>抢购结束</a><a>100%</a><a style="width: 2.5rem;"></a></span>
					</p>
					<p :class="killStatus == 1 ? 'rightNow1' : ''" class="price">
						￥{{item.money}}{{item.mbn_detailsType | type}}
						<s>￥{{item.shop_money}}{{item.mbn_detailsType | type}}</s>
					</p>
					<button v-if="killStatus == 1" class="rightNow" @click="fuck(1)">即将开抢</button>
					<button v-if="killStatus == 2"  @click="goDetail(item.catid)">马上抢</button>
					<button v-if="killStatus == 3" @click="fuck(3)">抢购结束</button>
				</div>
			</div>
		</section>
		
		<section class="seckill-main" v-else>
			
			<div class="single" v-for="item in tomorrow">
				<img v-lazy="item.img" class="single-img" />
				<div class="single-detail">
					<p>{{item.name}} {{item.mbn_details}}</p>
					<p>一件起售 {{item.details}}</p>
					<p class="next">
						限量{{item.leastNum}}件 | 明日6:00开抢
					</p>
					<p class="price">
						￥{{item.money}}{{item.mbn_detailsType | type}}
						<s>￥{{item.shop_money}}{{item.mbn_detailsType | type}}</s>
					</p>
					<button class="next" @click="fuck(4)">即将开售</button>
				</div>
			</div>
		</section>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import config from "../config/config.js";
	import Alert from "../alert.vue";
	import share from "../share/share.js";
	export default{
		components:{
			"v-alert":Alert
		},
		filters:{
			type(val){
				return val == 1 ? "/斤" : "/个";
			}
		},
		data(){
			return {
				show:true,
				hour1:0,
				min1:0,
				sec1:0,
				hour2:0,
				min2:0,
				sec2:0,
				hour3:0,
				min3:0,
				sec3:0,
				killStatus:1,
				today:[],
		        tomorrow:[],
		        alertshow:false,
		        context:"",
		        timer1:null,
		        timer2:null,
		        timer3:null
			}
		},
		methods:{
			goDetail(id){
				this.$router.push("/detail/" + id);
			},
			tag(type){
				this.show = type == 1 ? true : false;
			},
			fuck(type){
				if(type == 1){
					this.alertshow = true;
					this.context = "抢购还未开始，请耐心等待";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
				}else if(type == 3){
					this.alertshow = true;
					this.context = "抢购已结束，请明日再来";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
				}else if(type == 4){
					this.alertshow = true;
					this.context = "亲，明日才开始啊";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
				}
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			share({
				title:"每日秒杀",
				desc:"妈妈爱果现推出每日秒杀活动，每天抢购抄底价水果，大家快来参与啊",
				link:"/seckill"
			});
			axios.post("/SecKill/GetList",{},config).then(res => {
				if(res.data.code == 0){
					this.today = res.data.data.today;
					this.tomorrow = res.data.data.tomorrow;
					
					var time = new Date(res.data.data.time * 1000);
					var str = time.getFullYear() + "-" + (time.getMonth()+1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
					var time1 = new Date(time.getFullYear(),time.getMonth(),time.getDate(),"6","00","00");
					var time2 = new Date(time.getFullYear(),time.getMonth(),time.getDate(),"23","00","00");
					var time3 = new Date(time.getFullYear(),time.getMonth(),time.getDate()+1,"00","00","00");
					
					time = Date.parse(time);
					time1 = Date.parse(time1);
					time2 = Date.parse(time2);
					time3 = Date.parse(time3);
					
					if(time < time1){
						this.killStatus = 1;
						var count1 = (time1 - time)/1000;
						var count2 = (time2 - time)/1000;
						var count3 = (time3 - time)/1000;
						clearInterval(this.timer1);
						clearInterval(this.timer2);
						clearInterval(this.timer3);
						this.timer1 = setInterval(() => {
							if(count1 == 0){
								this.killStatus = 2;
							}else if(count2 == 0){
								this.killStatus = 3;
							}else if(count3 == 0){
								this.$router.go(0);
							}
							
							this.hour1 = Math.floor(count1/3600);
							this.min1 = Math.floor(count1%3600/60);
							this.sec1 = Math.floor(count1%60);
							
							this.hour2 = Math.floor(count2/3600);
							this.min2 = Math.floor(count2%3600/60);
							this.sec2 = Math.floor(count2%60);
							
							this.hour3 = Math.floor(count3/3600);
							this.min3 = Math.floor(count3%3600/60);
							this.sec3 = Math.floor(count3%60);
							
							count1--;
							count2--;
							count3--;
						},1000)
					}else if(time < time2){
						this.killStatus = 2;
						var count2 = (time2 - time)/1000;
						var count3 = (time3 - time)/1000;
						clearInterval(this.timer1);
						clearInterval(this.timer2);
						clearInterval(this.timer3);
						this.timer2 = setInterval(() => {
							if(count2 == 0){
								this.killStatus = 3;
							}else if(count3 == 0){
								this.$router.go(0);
							}
							this.hour2 = Math.floor(count2/3600);
							this.min2 = Math.floor(count2%3600/60);
							this.sec2 = Math.floor(count2%60);
							
							this.hour3 = Math.floor(count3/3600);
							this.min3 = Math.floor(count3%3600/60);
							this.sec3 = Math.floor(count3%60);
							count2--;
							count3--;
						},1000)
					}else if(time < time3){
						this.killStatus = 3;
						var count3 = (time3 - time)/1000;
						clearInterval(this.timer1);
						clearInterval(this.timer2);
						clearInterval(this.timer3);
						this.timer3 = setInterval(() => {
							if(count3 == 0){
								this.$router.go(0);
							}
							this.hour3 = Math.floor(count3/3600);
							this.min3 = Math.floor(count3%3600/60);
							this.sec3 = Math.floor(count3%60);
							count3--;
						},1000)
					}
					
				}
			});
			
			
		}
	}

</script>

<style>
</style>