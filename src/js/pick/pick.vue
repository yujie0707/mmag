<template>
	<div id="pick">
		<v-share></v-share>
		<img v-lazy="detail.img" class="pick-logo" />
		<div class="address">
			<div class="name">
				{{detail.name}}
			</div>
			<div class="addressDetail">
				{{detail.address}}
			</div>
			<div class="distance">
				<span>
					<img src="/dist/image/home/subhome/star_good.png" v-for="n in parseInt($route.params.goodLevel)"/><img src="/dist/image/home/subhome/star_bad.png" v-for="n in (5-parseInt($route.params.goodLevel))" />
				</span>
				<span>
					{{wifi}}
				</span>
				<span>
					距{{$route.params.distance}}km
				</span>
			</div>
		</div>
		<div class="price">
			<p>票价</p>
			<div class="adult">
				<span>￥{{detail.adult}}/人</span>
				<span>原价</span>
				<span>
					<img src="/dist/image/home/shopping/jianhao.png" @click="minus(1)"/><a>{{adultNum}}</a><img src="/dist/image/home/shopping/jiahao.png" @click="add(1)"/>
				</span>
			</div>
			<div class="adult">
				<span>￥{{detail.team}}/人</span>
				<span>共享价<br/><b>限量{{detail.shareTemp}}人</b></span>
				<span>
					<img src="/dist/image/home/shopping/jianhao.png" @click="minus(2)"/><a>{{teamNum}}</a><img src="/dist/image/home/shopping/jiahao.png" @click="add(2)"/>
				</span>
			</div>
			<div class="adult">
				<span>￥{{detail.child}}/人</span>
				<span>儿童价（半价）<br/><b>1.2-1.5（1.2米以下免费）</b></span>
				<span>
					<img src="/dist/image/home/shopping/jianhao.png" @click="minus(3)"/><a>{{childNum}}</a><img src="/dist/image/home/shopping/jiahao.png" @click="add(3)"/>
				</span>
			</div>
		</div>
		<div id="comment" v-if="detail.remark ? detail.remark.length > 0 : 0">
			<p class="commentNum">
				<span>
					顾客评价<a>（{{detail.remark[0].remarkNum}}）</a>
				</span>
				<span>
					好评度 <a>{{detail.remark[0].remarkPen}}</a>
				</span>
			</p>
			<p class="user">
				<img v-lazy="detail.remark[0].userImg" class="pic"/>
				<span class="phone">
					{{detail.remark[0].userPhone | mobile}}
				</span>
				<span class="star">
					<img src="/dist/image/home/subhome/star_good.png" v-for="n in parseInt(detail.remark[0].remarkLevel)"/>
					<img src="/dist/image/home/subhome/star_good.png" v-for="n in (5 - parseInt(detail.remark[0].remarkLevel))"/>
				</span>
			</p>
			
			<p class="commentContext">
				{{detail.remark[0].remarkValue}}
			</p>
			<p class="checkComment" @click="goTalking()">
				查看全部评论
			</p>
		</div>
		<div id="noComment" v-else>
			暂无评论
		</div>
		<div id="pickDetail">
			<div class="push">
				上拉查看商品详情
			</div>
			<div class="needKnow">
				<div class="title">
					<span>入园须知</span>
				</div>
				<div class="context">
					<p>
						<span>有效期：</span>
						<span>{{detail.openTimeSta}}至{{detail.openTimeEnd}}（周末法定节假日通用）</span>
					</p>
					<p>
						<span>订购说明：</span>
						<span>入园前均可购买</span>
					</p>
					<p>
						<span>使用方法：</span>
						<span>1.入园方式：快速入园，无需换票，凭订单号验证，进入采摘园请先确认入园<br />2.营业时间：9:00到19:00左右</span>
					</p>
					<p>
						<span>退款说明：</span>
						<span>支付订单后至门票失效一周内可退款</span>
					</p>
					<p>
						<span>商家电话:</span>
						<span>{{detail.phone}}</span>
					</p>
				</div>
			</div>
			<div class="detail-img">
				<img v-for="item in detail.img_details" :src="item.img" />
			</div>
		</div>
		<footer>
			<div>
				<a href="tel:4000011857">
					<img src="/dist/image/pick/phone_a.png" />
					<span>客服</span>
				</a>
			</div>
			<div>
				总价：￥{{total}}
			</div>
			<div @click="goOrder()">
				立即购买
			</div>
		</footer>
		<v-alert v-if="alertshow" context="请至少选择购买一张票"></v-alert>
	</div>
</template>

<script>
	import Share from "../detail/share.vue";
	import Alert from "../alert.vue";
	export default{
		components:{
			"v-share":Share,
			"v-alert":Alert
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
		data(){
			return{
				adultNum:0,
				childNum:0,
				teamNum:0,
				detail:{},
				alertshow: false
			}	    
		},
		computed:{
			wifi(){
				if(this.detail.wifi == 1){
					return "提供WiFi";
				}else{
					return "不提供WiFi";
				}
			},
			total(){
				if(this.detail.adult){
					return (this.detail.adult * this.adultNum + this.detail.team * this.teamNum + this.detail.child * this.childNum).toFixed(1);
				}else{
					return "0.0";
				}
			}
		},
		methods:{
			goTalking(){
				this.$router.push({
					name:"talking",
					params:{
						catid:this.$route.params.id
					}
				})
			},
			goOrder(){
				if(this.adultNum == 0 && this.teamNum == 0 && this.childNum == 0){
					this.alertshow = true;
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				var list = [];
				if(this.adultNum !== 0){
					var obj = {
						img: this.detail.img,
						name: this.detail.name,
						address: this.detail.address,
						type: "原价票",
						num: this.adultNum,
						price: this.detail.adult
					}
					list.push(obj);
				}
				if(this.teamNum !== 0){
					var obj = {
						img: this.detail.img,
						name: this.detail.name,
						address: this.detail.address,
						type: "共享票",
						num: this.teamNum,
						price: this.detail.team
					}
					list.push(obj);
				}
				if(this.childNum !== 0){
					var obj = {
						img: this.detail.img,
						name: this.detail.name,
						address: this.detail.address,
						type: "儿童票",
						num: this.childNum,
						price: this.detail.child
					}
					list.push(obj);
				}
				
				this.$router.push({
					name:"pickorder",
					params:{
						list: list,
						catid: this.detail.catid,
						time: this.detail.supplyTime,
						adultNum: this.adultNum,
						teamNum: this.teamNum,
						childNum: this.childNum
						
					}
					
				})
			},
			add(index){
				
				switch(index){
					case 1:
						var temp = this.adultNum;
						temp++;
						this.adultNum = temp;
						break;
					case 2:
						var temp = this.teamNum;
						temp++;
						this.teamNum = temp;
						break;
					case 3:
						var temp = this.childNum;
						temp++;
						this.childNum = temp;
						break;
					default:
						break;
				}
			},
			minus(index){
				switch(index){
					case 1:
						var temp = this.adultNum;
						temp--;
						this.adultNum = temp < 0 ? 0 : temp;
						break;
					case 2:
						var temp = this.teamNum;
						temp--;
						this.teamNum = temp < 0 ? 0 : temp;
						break;
					case 3:
						var temp = this.childNum;
						temp--;
						this.childNum = temp < 0 ? 0 : temp;
						break;
					default:
						break;
				}
			}
		},
		mounted(){
			axios({
				url:"http://ws.tianmaoetong.com/ec_category/details",
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
					catid: this.$route.params.id
				}
			}).then(res => {
				this.detail = res.data.data;
			})
		},
		activated(){
			axios({
				url:"http://ws.tianmaoetong.com/ec_category/details",
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
					catid: this.$route.params.id
				}
			}).then(res => {
				this.detail = res.data.data;
			})
			this.adultNum = 0;
			this.childNum = 0;
			this.teamNum = 0;
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
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