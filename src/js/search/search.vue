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
	
	import config from "../config/config.js";
	import share from "../share/share.js";
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
				axios.post("/search/details",{
					key:namename,
					level:level
				},config).then(res => {
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
				axios.post("/search/details",{
					key: this.search,
					level:0
				},config).then(res => {
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
						axios.post("/search/item",{
							key: this.search,
							level:0
						},config).then(res => {
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
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			share({});
			axios.post("/search/searchnum",{},config).then(res => {
				this.hot = res.data.data;
			})
			this.search = "";
			this.show = 0;
			this.history = JSON.parse(localStorage.getItem("list"));
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		}
	}
</script>

<style>
</style>