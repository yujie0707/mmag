<template>
	<div id="talkingNow">
		<v-header></v-header>
		<img v-lazy="$route.params.img" class="detailImg" />
		<div class="talking">
			<div class="talking-top">
				<p>满意程度</p>
				<p><img src="/dist/image/home/subhome/star_good.png" v-for="n in num" @click="change(n)" /><img src="/dist/image/home/subhome/star_bad.png" v-for="n in (5-num)" @click="change(num+n)"/></p>
				<p>{{num | level}}</p>
			</div>
			<div class="talking-bottom">
				<ul>
					<li @click="add('非常新鲜')">非常新鲜</li>
					<li @click="add('很好吃')">很好吃</li>
					<li @click="add('物流快')">物流快</li>
					<li @click="add('服务好')">服务好</li>
					<li @click="add('包装好')">包装好</li>
					<li @click="add('分量足')">分量足</li>
				</ul>
				<div class="text-wrap">
					<textarea placeholder="亲，喜欢就说出你的心声吧！！！" v-model="value"></textarea>
					<span>{{count}}/50</span>
				</div>
				<!--<div class="img-wrap">
					<div class="addImg">
						<img src="/dist/image/talkingnow/camera.png" />
						<span>添加图片</span>
					</div>
				</div>-->
			</div>
		</div>
		<v-alert v-if="alertshow" :context="context"></v-alert>
	</div>
</template>

<script>
	import Header from "./header.vue";
	import Alert from "../alert.vue";
	
	export default{
		components:{
			"v-header":Header,
			"v-alert":Alert
		},
		data(){
			return {
				num:0,
				count:0,
				value:"",
				alertshow:false,
				context:""
			}
		},
		methods:{
			change(n){
				this.num = n;
			},
			add(str){
				var temp = this.value;
				temp += str;
				this.value = temp;
			}
		},
		filters:{
			level:function(val){
				switch(val){
					case 0:
					return "请选星星";
					case 1:
					return "还行哟";
					case 2:
					return "很好呀";
					case 3:
					return "很满意";
					case 4:
					return "非常满意";
					case 5:
					return "超级满意";
				}
			}
		},
		watch:{
			"value":function(){
				
				this.count = this.value.length;
				if(this.count > 50){
					var temp = this.value;
					temp = temp.substring(0,50);
					this.value = temp;
				}
			}
		},
		activated(){
			wx.hideMenuItems({
			  menuList: ["menuItem:copyUrl","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		}
	}
</script>

<style>
</style>