<template>
	<div id="search">
		<header>
			<img src="/dist/image/search/return.png" @click="goback()"/>
			<div>
				<input type="text" placeholder="请输入搜索内容" v-model="search" />
				<img src="/dist/image/search/searchhui.png"/>
			</div>
			<span @click="gosearch()">搜索</span>
		</header>
		<div class="search-part">
			<div class="partOne" v-if="show == 0">
				<div class="hot">
					<p>热门搜索:</p>
					<ul class="hotlist">
						<li v-for="item in hot" @click="change(item)">{{item}}</li>
					</ul>
				</div>
				<div class="hot" v-if="history ? true : false">
					<p>历史记录:<img src="/dist/image/search/shanchu.png" style="height: .32rem;float: right;margin: .3rem .6rem 0 0;" @click="del()"/></p>
					<ul class="hotlist">
						<li v-for="item in history" @click="change(item)">{{item}}</li>
					</ul>
				</div>
			</div>
			<ul class="partTwo" v-else-if="show == 1">
				<li v-for="item in searchList" @click="searchLevel(item.name,item.level)">
					{{item.name}}
				</li>
			</ul>
			<div class="partThree" v-else>
				<v-single :data="item" v-for="item in searchProduct"></v-single>
			</div>
		</div>
		<v-alert v-if="alertshow" context="没有该商品内容"></v-alert>
	</div>
</template>

<script>
	import Single from "../home/subhome/hotsingle.vue";
	import Alert from "../alert.vue";
	export default{
		components:{
			"v-single":Single,
			"v-alert":Alert
		},
		data(){
			return {
				search:"",
				hot:[],
				searchList:[],
				show:0,
				searchProduct:[],
				timer:null,
				history: JSON.parse(localStorage.getItem("list")),
				alertshow:false
			}
		},
		mounted(){
			axios({
				url:"/search/searchnum",
				method:"post",
				headers:{
					"appid": 1,
			        "deviceid": "985ff090eb761e8329c64092ac421adf9afe3",
			        "channelid": "WX",
			        "UserAgent": "WX",
			        "productid": 1,
			        "userid":sessionStorage.getItem("userid"),
			        "usertoken":sessionStorage.getItem("usertoken")
				}
			}).then(res => {
				this.hot = res.data.data;
			})
		},
		methods:{
			del(){
				localStorage.removeItem("list");
				this.history = false;
			},
			goback(){
				this.$router.go(-1);
			},
			change(item){
				this.search = item;
			},
			searchLevel(name,level){
				var namename = level == 2 ? name : name.split(" ")[0];
				axios({
					url:"/search/details",
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
						key:namename,
						level:level
					}
				}).then(res => {
					var list = localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
					list.unshift(namename);
					list = [...new Set(list)];
					list = JSON.stringify(list);
					localStorage.setItem("list",list);
					this.searchProduct = res.data.data;
					this.show = 2;
				})
			},
			gosearch(){
				axios({
					url:"/search/details",
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
						key: this.search,
						level:0
					}
				}).then(res => {
					var list = localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
					list.unshift(this.search);
					list = [...new Set(list)];
					list = JSON.stringify(list);
					localStorage.setItem("list",list);
					this.searchProduct = res.data.data;
					this.show = 2;
				})
			}
		},
		watch:{
			"search":function(){
				if(this.search == ""){
					clearTimeout(this.timer);
					this.show = 0;
					this.history = JSON.parse(localStorage.getItem("list"));
				}else{
					clearTimeout(this.timer);
					this.timer = setTimeout(() => {
						axios({
							url:"/search/item",
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
								key: this.search,
								level:0
							}
						}).then(res => {
							if(res.data.data.length == 0){
								this.alertshow = true;
								setTimeout(() => {
									this.alertshow = false;
								},1000)
							}
							this.searchList = res.data.data;
							this.show = 1;
						})
					},500);
				}
			}
		},
		activated(){
			this.search = "";
			this.show = 0;
			this.history = JSON.parse(localStorage.getItem("list"));
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