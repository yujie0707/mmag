<template>
	<div id="addAdderss">
		<v-header></v-header>
		<div class="name">
			<span>收&ensp;货&ensp;人</span>
			<input type="text" placeholder="收货人姓名" v-model="name" />
		</div>
		<div class="phone">
			
			<span>联系电话</span>
			<input type="number" placeholder="快递员联系你的电话" v-model="phone" />
		</div>
		<div class="city" @click="show()">
			<span>所在城市</span>
			<span>
				<a>{{city}}</a>
			</span>
			<img src="/dist/image/address/more.png" />
		</div>
		<div class="address" @click="changeShow()">
			<span>收货地址</span>
			<span>
				<a>{{plot}}</a>
			</span>
			<img src="/dist/image/address/more.png" />
		</div>
		<div class="addressDetail">
			<span>详细地址</span>
			<input type="text" placeholder="楼号/单元/门牌号" v-model="addressDetail" />
		</div>
		<div class="type">
			<span>地址类型</span>
			<span :class="type == 1 ? 'active' : ''" @click="addressType(1)"><a>住宅</a></span>
			<span :class="type == 2 ? 'active' : ''" @click="addressType(2)"><a>公司</a></span>
			<span :class="type == 3 ? 'active' : ''" @click="addressType(3)"><a>学校</a></span>
			<span :class="type == 4 ? 'active' : ''" @click="addressType(4)"><a>其他</a></span>
		</div>
		<div class="defaultAddress">
			<span>设置为默认地址</span>
			<img v-if="isdefault" src="/dist/image/address/weimoren.png" @click="yesdefault()" />
			<img v-else src="/dist/image/address/yimoren.png" @click="nodefault()" />
		</div>
		<button class="send" @click="send()">保存收货地址</button>
		<div id="city" v-if="isshow" :style="{height:height + 'px'}">
			<div id="bottom">
				<header>
					<span class="cancle" @click="miss()">取消</span>
					<span class="city-choose">城市选择</span>
					<span class="back" @click="backto()">{{back}}</span>
				</header>
				<ul class="city" v-if="showcity == 0">
					<li v-for="item in provincelist" @click="tocity(item.provinceid,item.province)">{{item.province}}</li>
				</ul>
				
				<ul v-else-if="showcity == 1">
					<li v-for="item in citylist" @click="toarea(item.cityid,item.city)">{{item.city}}</li>
				</ul>
				<ul v-else>
					<li v-for="item in arealist" @click="area(item.id,item.county)">{{item.county}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import Header from "./header.vue";
	export default{
		components:{
			"v-header":Header
		},
		data(){
			return{
				name:"",
				phone:"",
				addressDetail:'',
				type:1,
				isdefault:true,
				provincelist:[],
				citylist:[],
				arealist:[],
				isshow:false,
				height: document.body.offsetHeight,
				showcity:0,
				back:"",
				city1:[],
				city:"所在城市",
				areaid:'',
				lng:'',
				lat:'',
				plot:"小区/街道/写字楼",
				addressid:''
			}
		},
		methods:{
			changeShow(){
				this.$parent.show = false;
			},
			yesdefault(){
				this.isdefault = false;
			},
			nodefault(){
				this.isdefault = true;
			},
			addressType(index){
				this.type = index;
			},
			miss(){
				this.isshow = false;
			},
			show(){
				this.isshow = true;
			},
			tocity(id,province){
				var that = this;
				axios({
					url:"http://ws.tianmaoetong.com/address/getarea",
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
						provinceid:id,
						cityid:''
					}
				}).then(res => {
					console.log(res);
					that.citylist = res.data.data;
					this.showcity = 1;
					this.city1[0] = province;
				})
			},
			toarea(id,aaa){
				var that = this;
				
				axios({
					url:"http://ws.tianmaoetong.com/address/getarea",
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
						provinceid:'',
						cityid:id
					}
				}).then(res => {
					console.log(res);
					that.arealist = res.data.data;
					this.showcity = 2;
					
					this.city1[1] = aaa;
				})
			},
			area(id,county){
				this.city1[2] = county;
				this.showcity = 0;
				this.isshow = false;
				var temp = this.city1;
				this.city = temp.join("");
				this.areaid = id;
			},
			backto(){
				if(this.showcity == 0){
					return;
				}else{
					var temp = this.showcity;
					temp--;
					this.showcity = temp;
				}
			},
			send(){
				if(!this.addressid){
					axios({
						url:"http://ws.tianmaoetong.com/address/adds",
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
							name: this.name,
							phone: this.phone,
							areaid: this.areaid,
							details: this.plot,
							adressnum: this.addressDetail,
							longitude: this.lng,
							latitude: this.lat,
							default: this.isdefault ? 2 : 1,
							type: this.type
						}
					}).then(res => {
						console.log(res);
						if(res.data.code == 0){
							this.$router.go(-1);
						}
					})
				}else{
					axios({
						url:"http://ws.tianmaoetong.com/address/update",
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
							name: this.name,
							phone: this.phone,
							areaid: this.areaid,
							details: this.plot,
							adressnum: this.addressDetail,
							longitude: this.lng,
							latitude: this.lat,
							default: this.isdefault ? 2 : 1,
							type: this.type,
							addressid: this.addressid
						}
					}).then(res => {
						console.log(res);
						if(res.data.code == 0){
							this.$router.go(-1);
						}
					})
				}
			}
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
		mounted(){
			axios({
				url:"http://ws.tianmaoetong.com/address/getarea",
				method:"post",
				headers:{
					"appid": 1,
			        "deviceid": "985ff090eb761e8329c64092ac421adf9afe3",
			        "channelid": "WX",
			        "UserAgent": "WX",
			        "productid": 1,
			        "userid":sessionStorage.getItem("userid"),
			        "usertaken":sessionStorage.getItem("usertaken")
				}
			}).then(res => {
				console.log(res);
				this.provincelist = res.data.data;
			})
			
			if(this.$route.params.data){
				var item = this.$route.params.data;
				this.name = item.name;
				this.phone = item.phone;
				this.city = item.province + item.city + item.county;
				this.plot = item.details;
				this.addressDetail = item.addressnum;
				this.isdefault = item.default == 1 ? false : true;
				this.addressid = item.addressid;
				this.areaid = item.areaid;
				this.lng = item.longitude;
				this.lat = item.latitude;
			}
		},
		activated(){
			if(this.$route.params.data){
				var item = this.$route.params.data;
				this.name = item.name;
				this.phone = item.phone;
				this.city = item.province + item.city + item.county;
				this.plot = item.details;
				this.addressDetail = item.addressnum;
				this.isdefault = item.default == 1 ? false : true;
				this.addressid = item.addressid;
				this.areaid = item.areaid;
				this.lng = item.longitude;
				this.lat = item.latitude;
			}else{
				this.name="";
				this.phone="";
				this.addressDetail='';
				this.type=1;
				this.isdefault=true;
				this.isshow=false;
				this.showcity=0;
				this.back="";
				this.city1=[];
				this.city="所在城市";
				this.areaid='';
				this.lng='';
				this.lat='';
				this.plot="小区/街道/写字楼";
				this.addressid=''
			}
		}
	}
</script>

<style>
</style>