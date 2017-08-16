<template>
	<div id="collect">
		<header>
			<img src="/dist/image/search/return.png" @click="goback()" />
			<span>我的收藏</span>
			<span class="change" v-if="del" @click="edit()">编辑</span>
			<span class="change" v-else @click="complete()">完成</span>
		</header>
		<p class="allProduct">
			<label v-if="!del" @click="checkAll()">
				<input type="checkbox" v-model="chooseAll" style="height: 0;width: 0;" />
				<img :src="chooseAll ? '/dist/image/home/shopping/xuanzhong.png' : '/dist/image/home/shopping/weixuanzhong.png'" />
			</label>
			全部商品（{{total}}）
		</p>
		<ul>
			<li v-for="(item,index) in collectList">
				<label v-if="!del">
					<input type="checkbox" v-model="choose[index]" style="height: 0;width: 0;" class="choose-input" />
					<img :src="choose[index] ? '/dist/image/home/shopping/xuanzhong.png' : '/dist/image/home/shopping/weixuanzhong.png'" class="choose" />
				</label>
				<router-link :to="{name:'detail',params:{id:item.catid}}">
					<img v-lazy="item.img" class="shopping-list-img" />
					<div class="shopping-list-detail">
						<p>{{item.name}} | {{item.mbn_details}}斤/件</p>
						<p>一件起售 {{item.details}}</p>
						<p>￥{{item.money}}/斤</p>
					</div>
				</router-link>
			</li>
		</ul>
		<input class="remove" v-if="!del" @click="remove()" value="删除" type="button">
	</div>
</template>

<script>
	export default{
		data(){
			return{
				del:true,
				total:0,
				choose:[],
				chooseAll:false,
				collectList:[]
			}
		},
		methods:{
			goback(){
				this.$router.go(-1);
			},
			edit(){
				this.del = false;
			},
			complete(){
				this.del = true;
			},
			checkAll(){
				var arr = []
				if(this.chooseAll){
					for(var i = 0; i < this.choose.length; i++){
						arr[i] = true;
					}
					this.choose = arr;
				}else{
					for(var i = 0; i < this.choose.length; i++){
						arr[i] = false;
					}
					this.choose = arr;
				}
			},
			remove(el){
				
				var list = [];
				var llist = this.collectList;
				var choose = this.choose;
				if(llist.length == 0 || choose.every(cur => cur == false)){
					return;
				}
				var catid = '';
				for(var i = choose.length - 1; i >= 0; i--){
					if(choose[i]){
						list.push(llist[i].catid);
						llist.splice(i,1);
						choose.splice(i,1);
					}
				}
				catid = list.join("_");
				axios({
					url:"http://ws.tianmaoetong.com/ec_collection/del",
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
						catids:catid
					}
				}).then(res => {
					console.log(res.data)
					if(res.data.code == 0){
						this.collectList = llist;
						this.choose = choose;
						this.total = this.choose.length;
						this.del = true;
						this.chooseAll = false;
					}
				})
			}
		},
		watch:{
			"choose":function(){
				if(this.choose.every(cur => cur == true)){
					this.chooseAll = true;
				}else{
					this.chooseAll = false;
				}
			}
		},
		mounted(){
			axios({
				url:"http://ws.tianmaoetong.com/ec_collection/search",
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
				console.log(res.data.data);
				if(res.data.code == 0){
					this.collectList = res.data.data;
					var arr = [];
					for(var i = 0; i < res.data.data.length; i++){
						arr[i] = false;
					}
					this.choose = arr;
					this.total = res.data.data.length;
				}
			})
		},
		activated(){
			this.del = true;
			this.chooseAll = false;
			axios({
				url:"http://ws.tianmaoetong.com/ec_collection/search",
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
				console.log(res.data.data);
				if(res.data.code == 0){
					this.collectList = res.data.data;
					var arr = [];
					for(var i = 0; i < res.data.data.length; i++){
						arr[i] = false;
					}
					this.choose = arr;
					this.total = res.data.data.length;
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