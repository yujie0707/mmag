<template>
	<div id="detail">
		<v-share></v-share>
		<div style="position: relative;overflow: hidden;">
			<v-swiper :data="detail.img_map ? detail.img_map : []"></v-swiper>
		</div>
		<div id="description">
			<p class="title">
				{{detail.name}} {{detail.mbn_details}}{{detail.mbn_detailsType | type}}/件 <img :src="'/dist/image/home/subhome/' + detail.level + '.png'" />
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
					共享价：￥{{detail.money}}/{{detail.mbn_detailsType | type}}
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
					{{detail.remark[0].userPhone}}
				</span>
				<span class="star">
					<img src="/dist/image/home/subhome/star_good.png" v-for="n in parseInt(detail.remark[0].remarkLevel)"/><img src="/dist/image/home/subhome/star_bad.png" v-for="n in (5 - parseInt(detail.remark[0].remarkLevel))"/>
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
	import config from "../config/config.js";
	export default{
		components:{
			"v-swiper":Swiper,
			"v-share":Share
		},
		filters:{
			type(val){
				return val == 1 ? "斤" : "个";
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/ec_category/details",{
				catid:this.$route.params.id
			},config).then(res => {
				this.detail = res.data.data;
				var that = this;
				wx.ready(function(){
					wx.onMenuShareTimeline({
					    title: that.detail.name, // 分享标题
					    link: 'http://ws.tianmaoetong.com/wx/Index?path=/detail/' + that.detail.catid, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					    imgUrl: that.detail.img_map[0].img, // 分享图标
					    success: function () { 
					        // 用户确认分享后执行的回调函数
					    },
					    cancel: function () { 
					        // 用户取消分享后执行的回调函数
					    }
					});
					wx.onMenuShareAppMessage({
					    title: that.detail.name, // 分享标题
					    desc: '中国首款共享农产品和农场采摘电商平台‘妈妈爱果’，数万用户收益，我也关注了妈妈爱果，邀请您一起来关注！', // 分享描述
					    link: 'http://ws.tianmaoetong.com/wx/Index?path=/detail/' + that.detail.catid, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					    imgUrl: that.detail.img_map[0].img, // 分享图标
					    type: '', // 分享类型,music、video或link，不填默认为link
					    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					    success: function () { 
					        // 用户确认分享后执行的回调函数
					    },
					    cancel: function () { 
					        // 用户取消分享后执行的回调函数
					    }
					});
					wx.hideMenuItems({
					  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] 
					});
				})
			})
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

				axios.post("/ec_shoppingcart/add",{
					catid:id
				},config).then(res => {
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
					axios.post("/ec_collection/add",{
						catid:id
					},config).then(res => {
						if(res.data.msg == "ok"){
							var temp = this.detail;
							temp.collStatus = 1;
							this.detail = temp;
						}
					})
				}else{
					axios.post("/ec_collection/del",{
						catids:id
					},config).then(res => {
						if(res.data.msg == "ok"){
							var temp = this.detail;
							temp.collStatus = 0;
							this.detail = temp;
						}
					})
				}
			}
		}
	}
</script>

<style>
</style>