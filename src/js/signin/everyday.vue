<template>
	<div id="everyday">
		<div class="top">
			<img class="bg" src="/dist/image/everyday/checkin_background@2x.png" />
			<p class="mypoints">我的积分：{{points}}</p>
			<div class="day">
				<img v-if="day < 1" src="/dist/image/everyday/integra_purple@2x.png" />
				<img v-else src="/dist/image/everyday/integra_yellow@2x.png" />
				<p>10</p>
				<p>积分</p>
				<p>第一天</p>
			</div>
			<div class="day">
				<img v-if="day < 2" src="/dist/image/everyday/integra_purple@2x.png" />
				<img v-else src="/dist/image/everyday/integra_yellow@2x.png" />
				<p>20</p>
				<p>积分</p>
				<p>第二天</p>
			</div>
			<div class="day">
				<img v-if="day < 3" src="/dist/image/everyday/integra_purple@2x.png" />
				<img v-else src="/dist/image/everyday/integra_yellow@2x.png" />
				<p>30</p>
				<p>积分</p>
				<p>第三天</p>
			</div>
			<div class="day">
				<img v-if="day < 4" src="/dist/image/everyday/integra_purple@2x.png" />
				<img v-else src="/dist/image/everyday/integra_yellow@2x.png" />
				<p>40</p>
				<p>积分</p>
				<p>第四天</p>
			</div>
			<div class="day">
				<img v-if="day < 5" src="/dist/image/everyday/integra_purple@2x.png" />
				<img v-else src="/dist/image/everyday/integra_yellow@2x.png" />
				<p>50</p>
				<p>积分</p>
				<p>第五天</p>
			</div>
			<div class="day">
				<img v-if="day < 6" src="/dist/image/everyday/integra_purple@2x.png" />
				<img v-else src="/dist/image/everyday/integra_yellow@2x.png" />
				<p>60</p>
				<p>积分</p>
				<p>第六天</p>
			</div>
			<div class="day">
				<img v-if="day < 7" src="/dist/image/everyday/integra_purple@2x.png" />
				<img v-else src="/dist/image/everyday/integra_yellow@2x.png" />
				<p>70</p>
				<p>积分</p>
				<p>第七天</p>
			</div>
			<img class="signin" v-if="isSignin" src="/dist/image/everyday/sign_-success@2x.png" />
			<img class="signin" v-else src="/dist/image/everyday/sign_-immediately@2x.png" @click="signin()" />
		</div>
		<div class="bottom">
			<div class="pointsType">
				<img src="/dist/image/everyday/play_earn@2x.png" />
				<img src="/dist/image/everyday/lottery_area@2x.png" @click="goSignin()" />
				<img src="/dist/image/everyday/expiry_area@2x.png" @click="goCdkey()" />
				<p>每日惊喜赚不停</p>
			</div>
			
			<div class="rule">
				<img src="/dist/image/everyday/sign_rules@2x.png" />
				<p>1.每个用户每天可签到一次，首次签到领取10积分，连续第二天可领20积分，最多每天可获得70积分 </p>
				<p>2.每轮签到以7天为一周期，连续7天后签到记录清除，重新开始签到</p>
				<p>3.签到期间中断，再次签到重新开始记录</p>
				<p>4.玩赚积分专区特设抽奖和兑奖活动，欢迎广大用户体验</p>
				<p>5.本活动最终解释权归妈妈爱果所有</p>
			</div>
		</div>
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
		data(){
			return {
				alertshow:false,
				context:"",
				points:0,
				day:0,
				isSignin:false
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			share({
				title:"妈妈爱果-每日签到",
				link:"/everyday",
				desc:"每日签到赢好礼，最高可得iPhone手机"
			})
			axios.post("/Integral/Dailyin",{},config).then(res => {
				if(res.data.code == 0){
					this.day = res.data.data.day;
					this.isSignin = res.data.data.type == 0 ? false : true;
					this.points = res.data.data.integral;
				}
			})
		},
		methods:{
			signin(){
				axios.post("/Integral/Dailybt",{},config).then(res => {
					if(res.data.code == 0){
						this.day = res.data.data.day;
						this.isSignin = true;
						this.points = res.data.data.integral;
					}else if(res.data.code == 5061){
						this.alertshow = true;
						this.context = "今日已完成签到";
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}
				})
				
			},
			goSignin(){
				this.$router.push("/signIn/"+this.points);
			},
			goCdkey(){
				this.$router.push("/cdkey");
			}
		}
	}
</script>

<style>
</style>