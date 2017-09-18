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
				<a @click="goDetail(item.catid,item.goodStatus)">
					<img v-lazy="item.img" class="shopping-list-img" />
					<img src="/dist/image/yiguoqi.png" v-if="item.goodStatus == 2" class="over" />
					<div class="shopping-list-detail">
						<p>{{item.name}} | {{item.mbn_details}}斤/件</p>
						<p>一件起售 {{item.details}}</p>
						<p>￥{{item.money}}/斤</p>
					</div>
				</a>
			</li>
		</ul>
		<input class="remove" v-if="!del" @click="remove()" value="删除" type="button">
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import config from "../config/config.js";
	import Alert from "../alert.vue";
	export default{
		components:{
			"v-alert":Alert
		},
		data(){
			return{
				del:true,
				total:0,
				choose:[],
				chooseAll:false,
				collectList:[],
				alertshow:false,
				context:''
			}
		},
		methods:{
			goDetail(id,goodStatus){
				if(goodStatus == 2){
					this.alertshow = true;
					this.context = "该商品已下架";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				
				this.$router.push({
					name:"detail",
					params:{
						id:id
					}
				})
			},
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
				axios.post("/ec_collection/del",{
					catids:catid
				},config).then(res => {
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
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			this.del = true;
			this.chooseAll = false;
			axios.post("/ec_collection/search",{},config).then(res => {
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
		}
	}
</script>

<style>
</style>