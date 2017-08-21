<template>
	<div id="detail">
		<v-share></v-share>
		<div style="position: relative;overflow: hidden;">
			<v-swiper :data="detail.img_map ? detail.img_map : []"></v-swiper>
		</div>
		<div id="description">
			<p class="title">
				{{detail.name}} {{detail.mbn_details}}斤/件 <img :src="'/dist/image/home/subhome/' + detail.level + '.png'" />
			</p>
			<p class="one">
				一件起售 {{detail.details}}
				<img src="/dist/image/home/subhome/all.png" />
				<img src="/dist/image/home/subhome/send.png" />
			</p>
			<p class="taste">
				<span>
					{{detail.taste_details}}
				</span>
				<span>
					￥{{(detail.money * detail.mbn_details).toFixed(2)}}/件
				</span>
			</p>
			<p class="price">
				<span>
					共享价：￥{{detail.money}}/斤
				</span>
				<span>商超价/<s>￥{{detail.shop_money}}</s></span>
			</p>
			<p class="tip">
				<span>
					<img src="/dist/image/detail/duihao.png"/>质量保证
				</span>
				<span>
					<img src="/dist/image/detail/duihao.png"/>全程冷链
				</span>
				<span>
					<img src="/dist/image/detail/duihao.png"/>免费配送
				</span>
				<span>
					<img src="/dist/image/detail/duihao.png"/>急速退货
				</span>
			</p>
		</div>
		<!--
        	作者：yujie_0707@163.com
        	时间：2017-07-27
        	描述：评论（详情页）
        -->
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
		<div id="productDetail">
			<p class="title">
				上拉查看商品详情
			</p>
			
			<table cellspacing="0" cellpadding="">
				<tr>
					<td>配送范围</td>
					<td>{{detail.scope}}</td>
				</tr>
				<tr>
					<td>产地</td>
					<td>{{detail.homeland}}</td>
				</tr>
				<tr>
					<td>营养价值</td>
					<td>{{detail.work}}</td>
				</tr>
			</table>
			<p class="standard">
				规格标准
			</p>
			<p class="name">
				品名：{{detail.name}}
			</p>
			<table cellspacing="0">
				<tr>
					<td></td>
					<td>特级</td>
					<td>一级</td>
					<td>二级</td>
					<td>三级</td>
				</tr>
				<tr>
					<td>规格</td>
					<td>{{detail.superStand}}</td>
					<td>{{detail.oneStand}}</td>
					<td>{{detail.twoStand}}</td>
					<td>{{detail.threeStand}}</td>

				</tr>
				<tr>
					<td>单果重/g</td>
					<td>{{detail.superDetail}}</td>
					<td>{{detail.oneDetail}}</td>
					<td>{{detail.twoDetail}}</td>
					<td>{{detail.threeDetail}}</td>
				</tr>
				<tr>
					<td>外观</td>
					<td colspan="4">{{detail.outlook}}</td>
				</tr>
				<tr>
					<td>口感</td>
					<td colspan="4">{{detail.taste_details}}</td>
				</tr>
				<tr>
					<td>包装系数/500g</td>
					<td colspan="4">{{detail.mbn_details}}</td>
				</tr>
			</table>
		</div>
		<img :src="detail.advertImg[0] ? detail.advertImg[0] : ''" class="advert"/>
		<img :src="detail.img_details" class="advert" />
		<footer>
			<div @click="goShopping()">
				<img src="/dist/image/detail/gouwuche_weixuanzhong.png" />
				<span>购物车</span>
				
				<span id="num" v-if="detail.carNum > 0">
					{{detail.carNum}}
				</span>
			</div>
			<div @click="addSave(detail.catid)">
				<img :src="detail.collStatus == 0 ? '/dist/image/detail/shoucang_a.png' : '/dist/image/detail/shoucang_c.png'" />
				<span>收藏</span>
			</div>
			<div class="button">
				
				<div @click="add(detail.catid)">加入购物车</div>
				<div @click="goOrder()">立即购买</div>
			</div>
		</footer>
		
	</div>
</template>

<script>
	import Swiper from "./swiper.vue";
	import Store from "../store/store.js";
	import Share from "./share.vue";
	export default{
		components:{
			"v-swiper":Swiper,
			"v-share":Share
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
		mounted(){
			axios({
				url:"/ec_category/details",
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
					catid:this.$route.params.id
				}
			}).then(res => {
				this.detail = res.data.data;
			})
		},
		activated(){
			axios({
				url:"/ec_category/details",
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
					catid:this.$route.params.id
				}
			}).then(res => {
				this.detail = res.data.data;
			})
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		},
		data(){
			return {
				id: this.$route.params.id,
				swiper: [],
				detail: {}
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
				Store.dispatch({
					type:"ORDER",
					context:{
						detail:{
							list:[{
						      "catid": this.detail.catid,
						      "num": 1,
						      "price": this.detail.money,
						      "img": this.detail.img,
						      "shop_price": this.detail.shop_money,
						      "names": this.detail.name,
						      "details": this.detail.details,
						      "mbn_details": this.detail.mbn_details
						    }]
						},
						type:2
					}
				});
				this.$router.push({
					name:"order",
					params:{
						address:false
					}
				});
			},
			add(id){
				axios({
					url:"/ec_shoppingcart/add",
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
						catid:id
					}
				}).then(res => {
					Store.dispatch({
						type:"NUM",
						context: res.data.data.carNum
					})
					var temp = this.detail;
					temp.carNum++;
					this.detail= temp;
				})
			},
			goShopping(){
				this.$router.push("/home/shopping");
				
			},
			addSave(id){
				if(this.detail.collStatus == 0){
					axios({
						url:"/ec_collection/add",
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
							catid:id
						}
					}).then(res => {
						if(res.data.msg == "ok"){
							var temp = this.detail;
							temp.collStatus = 1;
							this.detail = temp;
						}
					})
				}else{
					axios({
						url:"/ec_collection/del",
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
							catids:id
						}
					}).then(res => {
						if(res.data.msg == "ok"){
							var temp = this.detail;
							temp.collStatus = 0;
							this.detail = temp;
						}
					})
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