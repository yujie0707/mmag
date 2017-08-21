<template>
	<div id="address">
		<v-header></v-header>
		<div class="addressEmpty" v-if="show">
			<img src="/dist/image/address/meidizhi.png" />
			<button class="addAddress" @click="add()">
				新增地址
			</button>
		</div>
		<ul v-else>
			<li v-for="(item,index) in addressList">
				<div class="address-wrap" @click="jump(item)">
					<p>
						<span>{{item.name}}</span>
						<span v-if="item.default == 1" class="isdefault">默认</span>
						<span>{{item.phone}}</span>
					</p>
					<p>
						<span>{{item.province}}</span>
						<span>{{item.city}}</span>
						<span>{{item.county}}</span>
					</p>
					<p>
						{{item.details}}{{item.addressnum}}
					</p>
					<p>
						地址类型：{{item.type | type}}
					</p>
				</div>
				<img src="/dist/image/address/bianji.png" class="edit" @click="edit(item)" />
				<img src="/dist/image/address/shanchu.png" class="del" @click="del(index,item.addressid)" />
			</li>
		</ul>
		<v-footer v-if="!show"></v-footer>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import Header from "./header.vue";
	import Footer from "./footer.vue";
	import Alert from "../alert.vue";
	export default{
		components:{
			"v-header":Header,
			"v-footer":Footer,
			"v-alert":Alert
		},
		data(){
			return{
				show: true,
				addressList: [],
				alertshow: false,
				context: "删除成功"
			}
		},
		filters:{
			type:function(val){
				switch(val){
					case "1":
						return "住宅";
					case "2":
						return "公司";
					case "3":
						return "学校";
					case "4":
						return "其他";
				}
			}
		},
		methods:{
			jump(item){
				if(sessionStorage.getItem("isjump") == 1){
					this.$router.push({
						name:"order",
						params:{
							address:JSON.stringify(item)
						}
					})
				}
			},
			del(index,addressid){
				axios({
					url:"/address/del",
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
						addressid:addressid
					}
				}).then(res => {
					if(res.data.code == 0){
						this.context = "删除成功";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
						axios({
							url:"/address/search",
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
								isdefault:100
							}
						}).then(res => {
							console.log(res);
							if(res.data.code == 0){
								this.addressList = res.data.data;
								this.show = false;
							}else if(res.data.code == 220){
								this.show = true;
							}
						})
					}else{
						this.context = "删除失败";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}
				})
			},
			edit(item){
				this.$router.push({
					name:"addAddress",
					params:{
						data:item
					}
				})
			},
			add(){
				this.$router.push("/addAddress");
			}
			
		},
		mounted(){
			axios({
				url:"/address/search",
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
					isdefault:100
				}
			}).then(res => {
				console.log(res.data.data);
				if(res.data.code == 0){
					this.addressList = res.data.data;
					this.show = false;
				}else if(res.data.code == 220){
					this.show = true;
				}
			})
		},
		activated(){
			axios({
				url:"/address/search",
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
					isdefault:100
				}
			}).then(res => {
				console.log(res);
				if(res.data.code == 0){
					this.addressList = res.data.data;
					this.show = false;
				}else if(res.data.code == 220){
					this.show = true;
				}
			})
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