<template>
	<div id="signin">
		<div class="top">
			<span class="count">我的积分：{{points}}</span>
			<span class="rule" @click="rule()">规则</span>
		</div>
		
		<div class="pan">
			<img src="/dist/image/signin/turntable_index@2x.png" />
			<img src="/dist/image/signin/click.png" @click="draw()"  />
			<img src="/dist/image/signin/turntable@2x.png" :style="turn" />
		</div>
		
		<div class="per">
			20积分抽一次
		</div>
		
		<div class="rule-wrap" :style="{height:height + 'px'}" v-if="ruleshow" @click="rulehide()">
			<div class="ruler">
				<p><span></span> 活动规则 <span></span></p>
				<p>参与活动即有机会获得IPhone7。活动为概率中奖，奖品数量有限，祝您好运！</p>
				<p>1.凭兑换码去小编微信18265425311领取现金红包</p>
				<p>2.优惠券的规则详见我的页面-优惠券查看</p>
				<p>3.实物类奖品将在活动结束5-10个工作日安排发货，请耐心等待</p>
				<button>知道了</button>
			</div>
		</div>
		
		<div class="coupon-wrap" :style="{height:height + 'px'}" v-if="couponshow" @click="couponhide()">
			<div class="coupon">
				<img src="/dist/image/signin/Coupons_background@2x.png" />
				<img src="/dist/image/signin/button_coupon@2x.png" />
				<img v-if="couponType == 5" src="/dist/image/signin/five_yuan@2x.png" />
				<img v-if="couponType == 8" src="/dist/image/signin/eight_yuan@2x.png" />
				<img class="ten" v-if="couponType == 10" src="/dist/image/signin/ten_yuan@2x.png" />
			</div>
		</div>
		
		<div class="red-wrap" :style="{height:height + 'px'}" v-if="redshow" @click="redhide()">
			<img src="/dist/image/signin/redenvelopes_background@2x.png" />
			<img src="/dist/image/signin/button_redenvelopes@2x.png" />
			<div>￥<span>2</span></div>
		</div>
		
		<div class="code-wrap" :style="{height:height + 'px'}" v-if="codeshow"  >
			<img src="/dist/image/signin/receive_envelope@2x.png" />
			<img src="/dist/image/signin/qr_code@2x.png" />
			<div>
				<p>长按识别二维码</p>
				<p>加小编微信凭兑换码领取</p>
			</div>
			<div>
				<p>兑换码：{{cdkey}}</p>
				<p>长按可复制兑换码</p>
			</div>
			<img src="/dist/image/signin/close@2x.png" @click="codehide()" />
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
			return{
				alertshow:false,
				context:"",
				turn:{},
				ruleshow:false,
				height:0,
				couponshow:false,
				couponType:10,
				redshow:false,
				
				codeshow:false,
				cdkey:"",
				points:0,
				count:0,
				lock:false
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			share({});
			this.height = document.body.offsetHeight;
			this.points = this.$route.params.points;
		},
		methods:{
			draw(){
				if(this.lock){
					this.alertshow = true;
					this.context = '本次抽奖还未结束，请耐心等待';
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				this.lock = true;
				var temp = this.count;
				temp++;
				this.count = temp;
				axios.post("/integral/Prizedraw",{},config).then(res => {
					if(res.data.code == 5011){
						this.alertshow = true;
						this.context = "积分数量不足";
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}else if(res.data.code == 0){
						this.turn = {
							transform: "rotate(" + (3600*this.count + res.data.data.degree%3600) + "deg)"
						}
						if(res.data.data.type == 1){
							setTimeout(() => {
								this.couponshow = true;
								this.couponType = res.data.data.other;
								this.points = res.data.data.integral;
								this.lock = false;
							},5500)
						}else if(res.data.data.type == 2){
							setTimeout(() => {
								this.redshow = true;
								this.lock = false;
								this.points = res.data.data.integral;
								this.cdkey = res.data.data.CDkey;
							},5500)
						}else if(res.data.data.type == 3){
							setTimeout(() => {
								this.lock = false;
								this.points = res.data.data.integral;
								this.alertshow = true;
								this.context = "很遗憾，你没有中奖";
								setTimeout(() => {
									this.alertshow = false;
								},1000)
							},5500)
						}
					}
				})

			},
			rule(){
				this.ruleshow = true;
			},
			rulehide(){
				this.ruleshow = false;
			},
			couponhide(){
				this.alertshow = true;
				this.context = "领取成功";
				setTimeout(() => {
					this.alertshow = false;
				},1000)
				this.couponshow = false;
			},
			redhide(){
				this.redshow = false;
				this.codeshow = true;
			},
			codehide(){
				this.codeshow = false;
			}
		}
	}
</script>

<style>
</style>