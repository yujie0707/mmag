<template>
	<div id="shopping-list">
		<ul>
			<div>
			<li v-for="(item,index) in list">
				<label>
					<input type="checkbox" v-model="choose[index]" style="height: 0;width: 0;" class="choose-input" />
					<img :src="choose[index] ? '/dist/image/home/shopping/xuanzhong.png' : '/dist/image/home/shopping/weixuanzhong.png'" class="choose" />
				</label>
				<a @click="goDetail(item.catid,item.goodStatus)">
					<img v-lazy="item.img" class="shopping-list-img" />
					<img src="/dist/image/yiguoqi.png" v-if="item.goodStatus == 2" class="over" />
					<div class="shopping-list-detail">
						<p>{{item.names}} | {{item.mbn_details}}斤/件</p>
						<p>一件起售 {{item.details}}</p>
						<p>￥<span>{{(item.price * item.mbn_details * item.num).toFixed(2).toString().split(".")[0]}}.</span>{{(item.price * item.mbn_details * item.num).toFixed(2).toString().split(".")[1]}}</p>
					</div>
				</a>
				<div class="shopping-list-num-wrap">
					<div class="shopping-list-num">
						<img src="/dist/image/home/shopping/jianhao.png" @click="minus(index,item.catid,item.goodStatus)" />
						<span>{{item.num}}</span>
						<img src="/dist/image/home/shopping/jiahao.png" @click="add(index,item.catid,item.goodStatus)" />
					</div>
				</div>
			</li>
			</div>
		</ul>
		<div id="shopping-bottom">
			<label>
				<input type="checkbox" v-model="chooseAll" @click="checkAll()"/>
				<img :src="chooseAll ? '/dist/image/home/shopping/xuanzhong.png' : '/dist/image/home/shopping/weixuanzhong.png'" class="choose" />
				全选
			</label>
			<div class="total">
				<span>合计：<a>￥<b>{{total.toFixed(2).split(".")[0]}}.</b>{{total.toFixed(2).split(".")[1]}}</a></span>
				<span>不包含运费</span>
			</div>
			<div class="account" @click="goOrder()">
				结算<span v-if="count">{{count}}</span>
			</div>
		</div>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import Store from "../../store/store.js";
	import config from "../../config/config.js";
	import Alert from "../../alert.vue";
	export default{
		components:{
			"v-alert":Alert
		},
		data(){
			return{
				chooseAll:false,
				list:[],
				choose:[],
				alertshow: false,
				context: ""
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
			goOrder(){
				var list = [];
				var shoppingList = [];
				var llist = this.list;
				var choose = this.choose;
				if(llist.length == 0 || choose.every(cur => cur == false)){
					return;
				}
				var orderid = '';
				for(var i = choose.length - 1; i >= 0; i--){
					if(choose[i]){
						if(llist[i].goodStatus == 2){
							this.alertshow = true;
							this.context = "结算商品不能包涵下架商品";
							setTimeout(() => {
								this.alertshow = false;
							},1000)
							return;
						}
						list.push(llist[i].orderid);
						shoppingList.push(llist[i]);
					}
				}
				orderid = list.join("_");
				Store.dispatch({
					type:"ORDER",
					context:{
						detail:{
							orderids:orderid,
							list:shoppingList
						},
						type: 1
					}
				})
				this.$router.push({
					name:"order",
					params:{
						address:false
					}
				});
			},
			add(index,id,goodStatus){
				if(goodStatus == 2){
					this.alertshow = true;
					this.context = "该商品已下架";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				axios.post("/ec_shoppingcart/add",{
					catid:id
				},config).then(res => {
					Store.dispatch({
						type:"NUM",
						context: res.data.data.carNum
					})
					var temp = this.list;
					temp[index].num++;
					this.list = temp;
				})
			},
			minus(index,id,goodStatus){
				if(goodStatus == 2){
					this.alertshow = true;
					this.context = "该商品已下架";
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				var temp = this.list;
				if(temp[index].num <= 1){
					return					
				}
				axios.post("/ec_shoppingcart/minus",{
					catid:id
				},config).then(res => {
					Store.dispatch({
						type:"NUM",
						context: res.data.data.carNum
					})
					
					
					temp[index].num--;
					this.list = temp;					
					
				})
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
		computed:{
			total(){
				var temp = this.choose;
				var total = 0;
				for(var i = 0; i < temp.length; i++){
					if(temp[i]){
						total += parseFloat(this.list[i].num) * parseFloat(this.list[i].mbn_details) * parseFloat(this.list[i].price)
					}
				}
				return total;
			},
			count(){
				var temp = this.choose;
				var count = 0;
				for(var i = 0; i < temp.length; i++){
					if(temp[i]){
						count += parseFloat(this.list[i].num);
					}
				}
				return count;
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/ec_shoppingcart/list",{},config).then(res => {
				if(res.data.msg == "ok"){
					this.list = res.data.data;
					if(res.data.data.length == 0){
						Store.dispatch({
							type:"NUM",
							context: 0
						})
						return;
					}
					var a = [];
					for(var i = 0; i < res.data.data.length; i++){
						a[i] = false;
					}
					this.choose = a;
					Store.dispatch({
						type:"NUM",
						context: res.data.data[0].carNum
					})
				}
			})
		},
		mounted(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/ec_shoppingcart/list",{},config).then(res => {
				if(res.data.msg == "ok"){
					this.list = res.data.data;
					if(res.data.data.length == 0){
						Store.dispatch({
							type:"NUM",
							context: 0
						})
						return;
					}
					var a = [];
					for(var i = 0; i < res.data.data.length; i++){
						a[i] = false;
					}
					this.choose = a;
					Store.dispatch({
						type:"NUM",
						context: res.data.data[0].carNum
					})
				}
			})
		}
	}
</script>

<style>
</style>