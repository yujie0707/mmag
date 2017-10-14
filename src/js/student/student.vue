<template>
	<div id="student">
		<img src="/dist/image/student/theme.png" class="theme" />
		<ul class="list">
			<li v-for="(item,index) in list">
				<div class="img-wrap" @click="godetail(item.id)">
					<img v-lazy="item.proImg" />
					<span>剩余{{item.leastNum}}件</span>
				</div>
				<div class="detail-wrap" @click="godetail(item.id)">
					<p>
						<span>{{item.proName}}</span>
						<span>{{item.taxDetails}}</span>
					</p>
					<p>
						<span>{{item.tag}}</span>
					</p>
					<p>
						专享价：￥{{item.price}}
					</p>

				</div>
				<img src="/dist/image/student/add.png" class="addshop" @click="add(item.id)" />
			</li>
		</ul>
		<div class="shop-wrap">
			<img src="/dist/image/student/car.png" @click="goshopping()" class="goshopping" />
			<span v-if="carNum > 0">{{carNum}}</span>
		</div>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import Alert from "../alert.vue";
	import config from "../config/config.js";
	export default{
		components:{
			"v-alert":Alert
		},
		data(){
			return {
				carNum:0,
				alertshow:false,
				context:"",
				list:[]
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/Ec_Category/StudentMakes",{},config).then(res => {
				if(res.data.code == 0){
					this.list = res.data.data;
				}
			})
			axios.post("/ec_shoppingcart/getnum",{},config).then(res => {
				if(res.data.code == 0){
					this.carNum = res.data.data.carNum;
				}
			})
			
			wx.ready(function(){
		        wx.hideMenuItems({
		            menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"]});
		
		        wx.onMenuShareAppMessage({
		            title: '妈妈爱果', // 分享标题
		            desc: '大家好，妈妈爱果现推出20元专区水果购买活动，青岛地区免费配送。', // 分享描述
		            link: 'http://ws.tianmaoetong.com/wx/Index?path=/student', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		            imgUrl:'http://ws.tianmaoetong.com/img/index/154846261648515.png', // 分享图标
		            type: '', // 分享类型,music、video或link，不填默认为link
		            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		            success: function () {
		                // 用户确认分享后执行的回调函数
		            },
		            cancel: function () {
		                // 用户取消分享后执行的回调函数
		            }
		        });
		        wx.onMenuShareTimeline({
		            title: '妈妈爱果', // 分享标题
		            link: 'http://ws.tianmaoetong.com/wx/Index?path=/student', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		            imgUrl:'http://ws.tianmaoetong.com/img/index/154846261648515.png', // 分享图标
		            success: function () {
		                // 用户确认分享后执行的回调函数
		            },
		            cancel: function () {
		                // 用户取消分享后执行的回调函数
		            }
		        });
		    })
		},
		methods:{
			add(id){
				axios.post("/ec_shoppingcart/add",{
					catid: id
				},config).then(res => {
					if(res.data.code == 0){
						this.context = "添加购物车成功";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
						this.carNum = res.data.data.carNum;
					}
				})
			},
			goshopping(){
				this.$router.push("/home/shopping");
			},
			godetail(id){
				this.$router.push({
					name:"detail",
					params:{
						id:id
					}
				})
			}
		}
	}
</script>

<style>
	
	
</style>