<template>
	<div id="help">
		<div class="top">
			<img src="/dist/image/bargain/top.png" />
			<div class="time">
				<a>{{day < 10 ? "0" + day : day}}</a>
				<span>天</span>
				<a>{{hour < 10 ? "0" + hour : hour}}</a>
				<span>时</span>
				<a>{{minute < 10 ? "0" + minute : minute}}</a>
				<span>分</span>
				<a>{{second < 10 ? "0" + second : second}}</a>
				<span>秒</span>
			</div>
			<div class="detail">
				<img :src="infomation.proImg" />
				<span>{{infomation.proName}}</span>
				<span>原价：￥{{infomation.allMoney}}</span>
			</div>
		</div>
		<div class="middle">
			<div class="bargain">
				<div class="l">
					<p>当前价</p>
					<p>{{infomation.nowMoney}}</p>
				</div>
				<div class="r">
					<p>已砍</p>
					<p>{{(infomation.allMoney - infomation.nowMoney).toFixed(2)}}</p>
				</div>
			</div>
			<div class="info" v-if="type == 1">
				<img v-lazy="infomation.userImg" class="headimg" />
				<p>{{infomation.userName}}你使用{{infomation.weaponName}}砍掉了{{infomation.cutMoney}}元，还可以找人帮砍，试试好友的刀法~~</p>
			</div>
			<div class="info" v-if="type == 3">
				<img v-lazy="infomation.userImg" class="headimg" />
				<p>{{infomation.userName}}你可以先为自己砍一刀，赶紧试试刀法吧~~</p>
			</div>
			<div class="info" v-if="type == 2">
				<img v-lazy="infomation.userImg" class="headimg" />
				<p>你正在为你的好友{{infomation.userName}}砍价，赶紧试试刀法吧~~</p>
			</div>
			<div class="info" v-if="type == 4">
				<img v-lazy="infomation.userImg" class="headimg" />
				<p>你成功使用{{infomation.weaponName}}为你的好友{{infomation.userName}}砍掉了{{infomation.cutMoney}}元，你也可以发起砍价，赶紧试试吧~~</p>
			</div>
			<div class="button" v-if="type == 1">
				<button @click="goOrder()">立即购买</button>
				<button @click="help()">找人帮砍</button>
			</div>
			<div class="button" v-else-if="type == 2">
				<button class="hand" @click="code()">手起刀落</button>
			</div>
			<div class="button" v-else-if="type == 3">
				<button class="hand" @click="code()">先来一刀</button>
			</div>
			<div class="button" v-else-if="type == 4">
				<button @click="goBargain()" class="buy0">我也要0元购</button>
				<button @click="help()">找人帮砍</button>
			</div>
		</div>
		<div class="list">
			<h3><span>砍价高手</span></h3>
			<ul>
				<li v-for="item in cutList">
					<img v-lazy="item.userImg" />
					<span>{{item.userName}}使用  <a style="color: #f00;">{{item.weapon}}</a> 砍掉了<a>{{item.money}}</a> 元</span>
				</li>
			</ul>
		</div>
		<div class="code-wrap" v-if="codeShow" :style="{height:height + 'px'}" @click="hide()">
			<div class="code">
				<p>你还未关注公众号</p>
				<img :src="img" />
				<p>请长按识别二维码</p>
			</div>
		</div>
		<div class="share-wrap" :style="{height:height + 'px'}" v-if="shareShow" @click="shareHide()">
			<img src="/dist/image/bargain/fruit_share@2x.png" class="img" />
			<img src="/dist/image/bargain/star_three@2x.png" class="img1" />
			<p>找人帮忙</p>
			<p>点击右上方按钮，发送给朋友，让他们来帮你砍</p>
		</div>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import config from "../config/config.js";
	import Store from "../store/store.js";
	import Alert from "../alert.vue";
	import share from "../share/share.js";
	export default{
		components:{
			"v-alert":Alert
		},
		data(){
			return {
				infomation:{},
				codeShow:false,
				height:0,
				shareid:"",
				alertshow:false,
				context:"",
				img:"",
				type:0,
				cutList:[],
				shareShow:false,
				address:false,
				end:false,
				day:0,
				hour:0,
				minute:0,
				second:0,
				timer:null
			}
		},
		activated(){
			var that = this;
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			wx.ready(function(){
				wx.getLocation({
				    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				    success: function (res) {
				    	that.address = true;
				    	that.alertshow = true;
				    	that.context = "定位成功";
				    	setTimeout(() => {
				    		that.alertshow = false;
				    	},1000)
				        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
				        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180
				        axios.post("/Utils/GetCity",{
				        	Lat:latitude,
				        	Lng:longitude
				        },config).then(res => {
				        	if(res.data.code == 0){
				        		if(res.data.data.result.addressComponent.city !== "青岛市"){
				        			that.$router.push("/no/1");
				        		}
				        	}
				        })
				    },
				    fail: function(){
				    	that.$router.push("/no/2");
				    },
				    cancle: function(){
				    	that.$router.push("/no/3");
				    }
				});
			})
			
			this.height = document.body.offsetHeight;
			this.shareid = sessionStorage.getItem("shareid");
			axios.post("/activity/GetCutList",{
				shareid:this.shareid
			},config).then(res => {
				if(res.data.code == 0){
					this.infomation = res.data.data.baseData;
					this.type = res.data.data.type;
					this.cutList = res.data.data.cutList;
					var time = res.data.data.eTime;
					clearInterval(this.timer);
					this.timer = setInterval(() => {
						if(time == 0){
							this.end = true;
							this.alertshow = true;
							this.context = "活动结束";
							setTimeout(() => {
								this.alertshow = false;
							},2000);
						}
						this.day = Math.floor(time/(3600*24));
						this.hour = Math.floor(time%(3600*24)/3600);
						this.minute = Math.floor(time%3600/60);
						this.second = Math.floor(time%60);
						time--;
					},1000)
					
					share({
						title:that.infomation.userName + '正在进行砍价活动，快来帮他啊',
						desc:'妈妈爱果推出砍价0元购活动，大家都来参与吧',
						imgUrl:that.infomation.userImg,
						link:"/help*" + that.shareid
					});
					
					if(res.data.data.type == 3){
						axios.post("/activity/CutButton",{
							type:1,
							shareid:this.shareid
						},config).then(res => {
							if(res.data.code == 0){
								if(res.data.data.type == 6){
									this.codeShow = true;
									this.img = res.data.data.img;
								}else if(res.data.data.type == 5){
									this.alertshow = true;
									this.context = "少侠，价格已经到了最低，不能再砍了~~";
									setTimeout(() => {
										this.alertshow = false;
									},1000)
								}else{
									this.infomation.allMoney = res.data.data.allMoney;
									this.infomation.nowMoney = res.data.data.nowMoney;
									this.infomation.cutMoney = res.data.data.cutMoney;
									this.infomation.weaponName = res.data.data.weaponName;
									this.cutList = res.data.data.cutList;
									this.type = res.data.data.type;
								}
							}
						})
						return;
					}
					
				}else if(res.data.code == 432){
					this.infomation = res.data.data.baseData;
					this.type = res.data.data.type;
					this.cutList = res.data.data.cutList;
					this.end = true;
					this.alertshow = true;
					this.context = "活动结束";
					setTimeout(() => {
						this.alertshow = false;
					},2000)
				}
				
			})
			
				
		},
		methods:{
			code(){
				if(this.end){
					this.alertshow = true;
					this.context = "活动结束";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				if(this.address == false){
					this.alertshow = true;
					this.context = "定位中...,马上就好";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				axios.post("/activity/CutButton",{
					type:1,
					shareid:this.shareid
				},config).then(res => {
					if(res.data.code == 0){
						if(res.data.data.type == 6){
							this.codeShow = true;
							this.img = res.data.data.img;
						}else if(res.data.data.type == 5){
							this.alertshow = true;
							this.context = "少侠，价格已经到了最低，不能再砍了~~";
							setTimeout(() => {
								this.alertshow = false;
							},1000)
						}else{
							this.infomation.allMoney = res.data.data.allMoney;
							this.infomation.nowMoney = res.data.data.nowMoney;
							this.infomation.cutMoney = res.data.data.cutMoney;
							this.infomation.weaponName = res.data.data.weaponName;
							this.cutList = res.data.data.cutList;
							this.type = res.data.data.type;
						}
					}
				})
			},
			goBargain(){
				if(this.end){
					this.alertshow = true;
					this.context = "活动结束";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				this.$router.push("/bargain");
			},
			goOrder(){
				if(this.end){
					this.alertshow = true;
					this.context = "活动结束";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				Store.dispatch({
					type:"ORDER",
					context:{
						detail:{
							list:[{
						      "catid": this.infomation.proId,
						      "num": 1,
						      "price": this.infomation.nowMoney,
						      "img": this.infomation.proImg,
						      "shop_price": '',
						      "names": this.infomation.proName,
						      "details": this.infomation.details,
						      "mbn_details": this.infomation.mbn_details
						    }]
						},
						type:3
					}
				});
				this.$router.push({
					name:"order",
					params:{
						address:false
					}
				});
			},
			hide(){
				if(this.end){
					this.alertshow = true;
					this.context = "活动结束";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				this.codeShow = false;
			},
			help(){
				if(this.end){
					this.alertshow = true;
					this.context = "活动结束";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				this.shareShow = true;
			},
			shareHide(){
				if(this.end){
					this.alertshow = true;
					this.context = "活动结束";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				this.shareShow = false;
			}
		}
	}
</script>

<style>
</style>