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
	import config from "../config/config.js";
	import share from "../share/share.js";
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
				axios.post("/address/del",{
					addressid:addressid
				},config).then(res => {
					if(res.data.code == 0){
						this.context = "删除成功";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
						axios.post("/address/search",{
							isdefault:100
						},config).then(res => {
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
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			share({});
			axios.post("/address/search",{
				isdefault:100
			},config).then(res => {
				if(res.data.code == 0){
					this.addressList = res.data.data;
					this.show = false;
				}else if(res.data.code == 220){
					this.show = true;
				}
			})
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			axios.post("/address/search",{
				isdefault:100
			},config).then(res => {
				if(res.data.code == 0){
					this.addressList = res.data.data;
					this.show = false;
				}else if(res.data.code == 220){
					this.show = true;
				}
			})
			
		}
	}
</script>

<style>
</style>