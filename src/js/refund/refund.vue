<template>
	<div id="refund" :style="slide">
		<v-header></v-header>
		<div class="fruit">
			<img v-lazy="item.img" class="detail-img" />
			<div class="detail">
				<div class="title">
					<span>{{item.name}}</span>
					<span>{{item.mbn_details}}</span>
				</div>
				<div class="weight">
					<span>一件起售</span>
					<span>{{item.details}}</span>
				</div>
				<div class="send">
					<img src="/dist/image/home/subhome/send.png"/>
					<img src="/dist/image/home/subhome/all.png"/>
				</div>
				<div class="price">
					<span>￥{{item.fin_money}}</span>
				</div>
			</div>
		</div>
		<div class="reason">
			<p @click="choose()">
				<span>退款原因</span>
				<img src="/dist/image/address/more.png" />
				<span>请选择</span>
			</p>
			<p>{{reason}}</p>
		</div>
		<div class="refundMoney">
			<span>退款金额：</span>
			<input type="number" placeholder="请输入退款金额" v-model="money" />
		</div>
		<div class="max">
			最多￥{{item.fin_money}}（含发货邮费￥0.00）
		</div>
		<div class="refundState">
			<span>退款说明</span><input type="text" placeholder="说明" v-model="state" />
		</div>
		<!--<div class="img-wrap">
			<p>上传凭证</p>
			<div class="addImg">
				<img src="/dist/image/talkingnow/camera.png" />
				<span>添加图片</span>
			</div>
		</div>-->
		<button class="submit" @click="submit()">提交</button>
		<div class="reason-wrap" :style="{height:height + 'px'}" v-if="show">
			<div class="bottom" :style="anima">
				<p>退款原因</p>
				<label @click="change('商品包装破损')">
					<span>商品包装破损</span>
					<input type="radio" value="商品包装破损" name="reason"/>
				</label>
				<label @click="change('商品变质/过期，质量不好')">
					<span>商品变质/过期，质量不好</span>
					<input type="radio" value="商品变质/过期，质量不好" name="reason"/>
				</label>
				<label @click="change('拍错了，不想要')">
					<span>拍错了，不想要</span>
					<input type="radio" value="拍错了，不想要" name="reason"/>
				</label>
				<label @click="change('发货慢，物流慢')">
					<span>发货慢，物流慢</span>
					<input type="radio" value="发货慢，物流慢" name="reason"/>
				</label>
				<button class="off" @click="off()">关闭</button>
			</div>
		</div>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import Header from "./header.vue";
	import Alert from "../alert.vue";
	import config from "../config/config.js";
	import share from "../share/share.js";
	export default{
		components:{
			"v-header":Header,
			"v-alert":Alert
		},
		data(){
			return {
				height: document.body.clientHeight,
				check:[false,false,false,false],
				show:false,
				reason:"",
				anima:{},
				state:'',
				item:{},
				height: document.body.offsetHeight,
				slide:{},
				alertshow:false,
				context:"请选择退款原因",
				money:''
			}
		},
		methods:{
			choose(){
				this.show = true;
				
				this.anima = {
					animation: "myfirst .3s"
				}
			},
			off(){
				this.anima = {
					animation: "mylast .3s"
				}
				setTimeout(()=>{
					
					this.show = false;
				},300)
			},
			change(str){
				this.reason = str;
			},
			submit(){
				if(this.reason == ""){
					this.context = "请选择退款原因";
					this.alertshow = true;
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				if(this.money == ""){
					this.context = "请输入退款金额";
					this.alertshow = true;
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				if(parseFloat(this.money) > parseFloat(this.item.fin_money)){
					this.context = "退款金额不能大于订单金额";
					this.alertshow = true;
					setTimeout(() => {
						this.alertshow = false;
					},1000)
					return;
				}
				axios.post("/ec_pay/backmoney",{
					orderid: this.item.orderid,
					type:1,
					money: this.money,
					backReason: this.reason,
					other: this.state,
					file:''
				},config).then(res => {
					if(res.data.code == 0){
						this.context = "退款审核中";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
						this.$router.go(-1);
						sessionStorage.setItem("index",5);
					}else{
						this.context = "退款失败,请重新尝试";
						this.alertshow = true;
						setTimeout(() => {
							this.alertshow = false;
						},1000)
					}
				})
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			share({});
			this.slide = {
				height:this.height + "px"
			}
			this.item = JSON.parse(this.$route.params.data);
			window.onresize = function(){
				var h = document.body.offsetHeight;
				if(h < that.height){
					that.slide = {
						position:"absolute",
						bottom:0,
						left:0,
						height:that.height + "px"
					}
				}else{
					that.slide = {
						height:that.height + "px"
					};
				}
			}
		}
	}
</script>

<style>
</style>