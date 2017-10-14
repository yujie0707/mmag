<template>
	<div id="footer">
		<router-link to="/home">
			<div @click="jump(0)">
				<img :src="cur == 0 ? '/dist/image/home/footer/shouye_xuanzhong.png' : '/dist/image/home/footer/shouye_weixuan.png'" />
				<span :class="cur ==0 ? 'active' : '' ">首页</span>
				
			</div>
		</router-link>
		<router-link to="/home/classify" >
			<div @click="jump(1)">
				<img :src="cur == 1 ? '/dist/image/home/footer/fenlei_xuanzhong.png' : '/dist/image/home/footer/fenlei.png'" />
				<span :class="cur == 1 ? 'active' : '' ">分类</span>
				
			</div>
		</router-link>
		<router-link to="/home/shopping">
			<div @click="jump(2)" style="position: relative;">
				
				<img :src="cur == 2 ? '/dist/image/home/footer/gouwuche_xuanzhong.png' : '/dist/image/home/footer/gouwuche.png'" />
				<span :class="cur ==2 ? 'active' : '' ">购物车</span>
				<span id="carNum" v-if="carNum">
					{{carNum}}
				</span>
			</div>
		</router-link>
		<router-link to="/home/my">
			<div @click="jump(3)">
				<img :src="cur == 3 ? '/dist/image/home/footer/wode_xuanzhong.png' : '/dist/image/home/footer/wode_weixuanzhong.png'" />
				<span :class="cur == 3 ? 'active' : '' ">我的</span>
				
			</div>
		</router-link>
	</div>
</template>

<script>
	import Store from "../store/store.js";
	
	export default{
		data(){
			return{
				cur:sessionStorage.getItem("cur") ? sessionStorage.getItem("cur") : 0,
				carNum: Store.getState().carNum,
				path:''
			}
		},
		methods:{
			jump(index){
				this.cur = index;
				sessionStorage.setItem("cur",index)
			},
			change(){
				var path = this.$route.path;
				
				switch (path){
					case "/home/":
						sessionStorage.setItem("cur",0)
						this.cur = 0;
						break;
					case "/home/classify":
						sessionStorage.setItem("cur",1)
						
						this.cur = 1;
						break;
					case "/home/shopping":
						sessionStorage.setItem("cur",2)
						this.cur = 2;
						break;
					case "/home/my":
						sessionStorage.setItem("cur",3)
						
						this.cur = 3;
						break;
					default:
						break;
				}
			}
		},
		mounted(){
			Store.subscribe(() => {
				this.carNum = Store.getState().carNum;
			})
		},
		watch:{
			"$route":"change",
		}
	}
</script>

<style>
</style>