<template>
	<div id="help">
		<div class="top">
			<img src="/dist/image/bargain/backgroundtop@2x.png" />
			<div class="detail">
				<img :src="info.baseData.proImg" />
				<span>{{info.baseData.proName}}</span>
				<span>原价：￥{{info.baseData.allMoney}}</span>
			</div>
		</div>
		<div class="middle">
			<div class="bargain">
				<div class="l">
					<p>当前价</p>
					<p>{{info.baseData.nowMoney}}</p>
				</div>
				<div class="r">
					<p>已砍</p>
					<p>{{info.baseData.allMoney - info.baseData.nowMoney}}</p>
				</div>
			</div>
			<div class="info" v-if="info.type == 1">
				<img v-lazy="info.baseData.userImg" class="headimg" />
				<p>{{info.baseData.userName}}一出手砍掉了{{info.baseData.cutMoney}}元，还可以找人帮砍，试试好友的刀法~~</p>
			</div>
			<div class="info" v-if="info.type == 3">
				<img v-lazy="info.baseData.userImg" class="headimg" />
				<p>{{info.baseData.userName}}你可以先为自己砍一刀，赶紧试试刀法吧~~</p>
			</div>
			<div class="info" v-if="info.type == 2">
				<img v-lazy="info.baseData.userImg" class="headimg" />
				<p>你正在为你的好友{{info.baseData.userName}}砍价，赶紧试试刀法吧~~</p>
			</div>
			<div class="info" v-if="info.type == 4">
				<img v-lazy="info.baseData.userImg" class="headimg" />
				<p>你成功为你的好友{{info.baseData.userName}}砍掉了{{info.baseData.cutMoney}}元，你也可以发起砍价，赶紧试试吧~~</p>
			</div>
			<div class="button" v-if="info.type == 1">
				<button @click="goOrder()">立即购买</button>
				<button>找人帮砍</button>
			</div>
			<div class="button" v-else-if="info.type == 2">
				<button class="hand" @click="code()">手起刀落</button>
			</div>
			<div class="button" v-else-if="info.type == 3">
				<button class="hand" @click="code()">先来一刀</button>
			</div>
			<div class="button" v-else-if="info.type == 4">
				<button @click="goBargain()">我也要买</button>
				<button>找人帮砍</button>
			</div>
		</div>
		<div class="list">
			<h3><span>砍价高手</span></h3>
			<ul>
				<li v-for="item in info.cutList">
					<img v-lazy="item.userImg" />
					<span>{{item.userName}}使用{{item.weapon}}帮你砍掉了 <a>{{item.money}}</a> 元</span>
				</li>
			</ul>
		</div>
		<div class="code-wrap" v-if="codeShow" :style="{height:height + 'px'}" @click="hide()">
			<div class="code">
				<p>我未关注公众号</p>
				<img src="/dist/image/bargain/code.png" />
				<p>长按识别二维码</p>
				<p>我已经关注过公众号</p>
				<p @click.stop="cutNow()">马上砍价</p>
			</div>
		</div>
	</div>
</template>

<script>
	import config from "../config/config.js";
	export default{
		data(){
			return {
				info:{},
				codeShow:false,
				height:0
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			this.height = document.body.offsetHeight;
			var obj = {};
		 	var arr = location.href.split("?")[1].split("&");
		 	for(var i = 0; i < arr.length; i++){
		 		obj[arr[i].split("=")[0]] = arr[i].split("=")[1];
		 	}
			var shareid = sessionStorage.getItem("shareid") || obj.shareid;
			axios.post("/activity/GetCutList",{
				shareid:shareid
			},config).then(res => {
				if(res.data.code == 0){
					this.info = res.data.data;
				}
			})
		},
		methods:{
			code(){
				this.codeShow = true;
			},
			goBargain(){
				this.$router.push("/bargain")
			},
			goOrder(){
				
			},
			hide(){
				this.codeShow = false;
			},
			cutNow(){
				
			}
		}
	}
</script>

<style>
</style>