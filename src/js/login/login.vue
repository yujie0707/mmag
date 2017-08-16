<template>
	<div id="login" :style="slide">
		<img src="/dist/image/logo.png" class="login-logo" />
		<div class="login-tel-wrap">
			<input type="number" class="login-tel" v-model="tel" placeholder="手机号" @focus="telGet()" @blur="telTake()" />
			<img class="login-tel-img" :src="isTel ? '/dist/image/logo/shouji_weixuan.png' : '/dist/image/logo/shouji_dianji.png'" />
		</div>
		<div class="login-invite-wrap" v-if="isShow">
			<input type="number" class="login-invite" placeholder="邀请码（可选）" @focus="inviteGet()" @blur="inviteTake()" />
			<img class="login-invite-img" :src="isInvite ? '/dist/image/logo/yaoqing_weixuan.png' : '/dist/image/logo/yaoqing_dianji.png'" />
		</div>
		<div class="login-yanzheng-wrap">
			<input type="number" class="login-yanzheng" v-model="yanzheng" placeholder="验证码" @focus="yanzhengGet()" @blur="yanzhengTake()" />
			<img class="login-yanzheng-img" :src="isYanzheng ? '/dist/image/logo/yanzhengma_weixuan.png' : '/dist/image/logo/yanzhengma_dianji.png'" />
			<span v-if="yanzhengTime == 0" @click="send()">发送验证码</span>
			<span v-else-if="yanzhengTime == 1">{{time}}s</span>
			<span v-else @click="send()">重新发送</span>
		</div>
		<div class="login-argee">
			<img :src="isXuan ? '/dist/image/logo/duihao_xuanzhong.png' : '/dist/image/logo/duihao_weixuan.png'" @click="agree()" />
			<a href="http://api.tianmaoetong.com:7777/h5/protocol">同意妈妈爱果用户服务协议</a>
		</div>
		<input type="button" class="login-submit" value="登录" :style="{background: ischoose}" @click="sendYanzheng()" />
		<v-alert :context="context" v-if="alertshow"></v-alert>
	</div>
</template>

<script>
	import Alert from "../alert.vue";
	export default{
		components:{
			"v-alert": Alert
		},
		data(){
			return{
				tel:'',//手机号码
				yanzheng:'',//验证码
				isXuan:true,//协议选中标志
				isYanzheng:true,//获取验证码焦点标志
				isTel:true,//手机号码获取焦点标致
				isInvite:true,
				ischoose:"#49b152",//登录按钮颜色
				yanzhengTime:0,//验证码状态
				time:'',
				isShow:false,
				slide:{},
				height:0,
				router:"/home",
				alertshow:false,
				context:"手机号码不合法"
			}
		},
		methods:{
			
			//获取 或者 失去焦点改变图片样式
			telGet(){
				this.isTel = false;
			},
			telTake(){
				
				this.isTel = true;
			},
			yanzhengGet(){
				this.isYanzheng = false;
			},
			yanzhengTake(){
				this.isYanzheng = true;
			},
			inviteGet(){
				this.isInvite = false;
			},
			inviteTake(){
				this.isInvite = true;
				
			},
			agree(){
				var temp = this.isXuan;
				this.isXuan = !temp;
			},
			
			//发送验证码
			send(){
				
				
				var that = this;
				
				axios({
					method: 'post',
					url: "http://ws.tianmaoetong.com/sms/login",
					params: {
						mobile:that.tel
					},
					headers:{
						'appid': 1,
				        'deviceid': "985ff090eb761e8329c64092ac421adf9afe3",
				        'channelid': "WX",
				        'useragent': "WX",
				        'productid': 1
					}
				}).then(res => {
					var obj = res.data;
					if(obj.code == 201){
						this.context = "手机号码不合法";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}else if(obj.code == 202){
						this.context = "操作频繁，请稍候再试";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}else{
						this.yanzhengTime = 1;
						this.time = 60;
						var timer = setInterval(()=>{
							if(this.time == 0){
								this.yanzhengTime = 2;
								clearInterval(timer);
							}
							var aaa = this.time;
							aaa--;
							this.time = aaa;
						},1000)
						this.context = "验证码已发送";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}
				})
			},
			sendYanzheng(){
				if(!this.isXuan){
					return;
				}
				var that = this;
				var smscode = this.yanzheng;
				if(smscode.length !== 4){
					return;
				}else{
					axios({
						method: 'post',
						url: "http://ws.tianmaoetong.com/user/login",
						params: {
							mobile:that.tel,
							smscode:that.yanzheng,
							wxcode: sessionStorage.getItem("code") ? sessionStorage.getItem("code") : ""
						},
						headers:{
							'appid': 1,
					        'deviceid': "985ff090eb761e8329c64092ac421adf9afe3",
					        'channelid': "WX",
					        'useragent': "WX",
					        'productid': 1
						}
					}).then(res => {
						var obj = res.data;
						if(obj.code == 201){
							this.context = "手机号码不合法";
							this.alertshow = true;
							setTimeout(() => {
								this.alertshow = false;
							},1000)
						}else if(obj.code == 204){
							this.context = "验证码错误";
							this.alertshow = true;
							setTimeout(() => {
								this.alertshow = false;
							},1000)
						}else if(obj.code == 2041){
							this.context = "登陆失败";
							this.alertshow = true;
							setTimeout(() => {
								this.alertshow = false;
							},1000)
						}else{
							sessionStorage.setItem("userid",res.data.data.userid);
							sessionStorage.setItem("usertoken",res.data.data.usertoken);
							var time = new Date();
							time = time.getTime() + 3*24*60*60*1000;
							var arr = {
								userid: res.data.data.userid,
								usertoken: res.data.data.usertoken,
								time: time
							}
							localStorage.setItem("info",JSON.stringify(arr));
							this.$router.push(this.router);
						}
					})
				}
			}
			
		},
		watch:{
			"isXuan":function(){
				if(this.isXuan){
					this.ischoose = "#49b152";
					
				}else{
					this.ischoose = "#b6e0ba";
				}
			},
			"tel":function(){
				if(this.tel.length == 11){
					this.isShow = true;
					document.querySelector(".login-tel").blur();
				}else{
					this.isShow = false;
				}
			},
			"yanzheng":function(){
				if(this.yanzheng.length == 4){
					document.querySelector(".login-yanzheng").blur();
				}
			}
		},
		activated(){

			this.tel = '';
			this.yanzheng = '';
			this.height = document.body.offsetHeight;
			var that = this;
			window.onresize = function(){
				var h = document.body.offsetHeight;
				if(h < that.height){
					that.slide = {
						position:"absolute",
						bottom:0,
						left:0
					}
				}else{
					that.slide = {};
				}
			}
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
					next();
				}else{
					var time = new Date();
					time = time.getTime() + 3*24*60*60*1000;
					var obj = JSON.parse(localStorage.getItem("info"));
					obj.time = time;
					localStorage.setItem("info",JSON.stringify(obj));
					sessionStorage.setItem("userid",JSON.parse(localStorage.getItem("info")).userid);
					sessionStorage.setItem("usertoken",JSON.parse(localStorage.getItem("info")).usertoken);
					next(vm => {
						vm.$router.push("/home");
					})
				}
			}else{
				next();
			}
		}
	}
</script>

<style lang="scss">
</style>