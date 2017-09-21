<template>
	<div id="subhome-pick" @scroll="scroll($el)" :style="{height:height + 'px',overflow:'auto'}">
		<ul>
			<li class="pick-single" v-for="item in picklist">
				<router-link :to="{name:'pick',params:{id:item.catid,goodLevel:item.goodLevel,distance:item.distance}}">
					<div class="top">
						
						<img v-lazy="item.img" class="pick-single-img" />
						<div class="pick-single-detail">
							<p class="title">{{item.name}}</p>
							<p class="address"><img src="/dist/image/home/subhome/dingwei_aa.png"/>{{item.address}}</p>
							<div class="goodlevel">
								<img src="/dist/image/home/subhome/star_good.png" v-for="n in item.goodLevel" />
								<img src="/dist/image/home/subhome/star_bad.png" v-for="n in (5-item.goodLevel)" />
							</div>
							<span class="distance">距{{item.distance}}km</span>
						</div>
					</div>
					<div class="price">
						<div class="wrap-left">
							<span>￥<b>{{item.adult.split(".")[0]}}</b>.{{item.adult.split(".")[1]}}/人</span>
							<span>￥<b>{{item.team.split(".")[0]}}</b>.{{item.team.split(".")[1]}}/人</span>
							<span>￥<b>{{item.child.split(".")[0]}}</b>.{{item.child.split(".")[1]}}/人</span>
						</div>
						<div class="wrap-right">
							<span>原价</span>
							<span>共享价</span>
							<span>儿童价(半价)<a>1.2-1.5米（1.2米以下免费）</a></span>
						</div>
					</div>
				</router-link>
			</li>
		</ul>
		<div class="loading" v-if="isLoading">
			<img src="/dist/image/home/subhome/loading.gif"/>
			加载中
		</div>
		<span class="toBottomOfPage" v-if="isShow">没有内容了</span>
	</div>
</template>

<script>
	import config from "../../config/config.js";
	export default{
		data(){
			return{
				isLoading: false,
				isShow: false,
				lock: true,
				page: 1,
				picklist: [],
				top:0
				   
			}
		},
		activated(){
			config.headers.userid = sessionStorage.getItem("userid");
			config.headers.usertoken = sessionStorage.getItem("usertoken");
			var that = this;
			/*this.page = 1;
			this.isShow = false;*/
			this.$el.scrollTop = sessionStorage.getItem("pickTop") ? sessionStorage.getItem("pickTop") : 0;
			if(this.picklist.length > 0){
				return;
			}else{
				if(sessionStorage.getItem("lng")){
					axios.post("/index/orchard",{
		        		longitude: sessionStorage.getItem("lng"),
		        		latitude: sessionStorage.getItem("lat"),
		        		city:"青岛市",
		        		page: that.page
			        },config).then(res => {
			        	if(res.data.code == 0){
			        		that.picklist = res.data.data;
			        	}
			        })
				}else if(sessionStorage.getItem("error")){
					axios.post("/index/orchard",{
		        		longitude: '120.369557',
		        		latitude: '36.094406',
		        		city:"青岛市",
		        		page: that.page
			        },config).then(res => {
			        	if(res.data.code == 0){
			        		that.picklist = res.data.data;
			        	}
			        })
				}else{
					
					/*AMap.service(["AMap.Geolocation"], function() { 
		               	//实例化城市查询类 
		               	var geolocation = new AMap.Geolocation({
		        			timeout: 10000,         
		               	});
		               	//自动获取用户IP，返回当前城市 
		               	geolocation.getCurrentPosition();
		    			AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
		    			AMap.event.addListener(geolocation, 'error', onError); 
		           	});*/ 
		           	wx.ready(function(){
			           	wx.getLocation({
						    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
						    success: function (res) {
						        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180
						        
						        sessionStorage.setItem("lng",longitude);
						        sessionStorage.setItem("lat",latitude);
						        
						        axios.post("/index/orchard",{
					        		longitude: longitude,
					        		latitude: latitude,
					        		city:"青岛市",
					        		page: that.page
						        },config).then(res => {
						        	if(res.data.code == 0){
						        		that.picklist = res.data.data;
						        	}
						        })
						    },
						    fail: function(res) {
						    	sessionStorage.setItem("fail","error");
						        if(sessionStorage.getItem("lng")){
									axios.post("/index/orchard",{
						        		longitude: sessionStorage.getItem("lng"),
						        		latitude: sessionStorage.getItem("lat"),
						        		city:"青岛市",
						        		page: that.page
							        },config).then(res => {
							        	if(res.data.code == 0){
							        		that.picklist = res.data.data;
							        	}
							        })
								}else{
									axios.post("/index/orchard",{
						        		longitude: '120.369557',
						        		latitude: '36.094406',
						        		city:"青岛市",
						        		page: that.page
							        },config).then(res => {
							        	if(res.data.code == 0){
							        		that.picklist = res.data.data;
							        	}
							        })
								}
						    }
						});
					});
					/*function onComplete(data) {
				        sessionStorage.setItem("lng",data.position.getLng());
				        sessionStorage.setItem("lat",data.position.getLat());
				        
				        axios.post("/index/orchard",{
			        		longitude: data.position.getLng(),
			        		latitude: data.position.getLat(),
			        		city:"青岛市",
			        		page: that.page
				        },config).then(res => {
				        	if(res.data.code == 0){
				        		that.picklist = res.data.data;
				        	}
				        })
				    }
				    //解析定位错误信息
				    function onError(data){
				        alert("定位失败");
				        sessionStorage.setItem("fail","error");
				        if(sessionStorage.getItem("lng")){
							axios.post("/index/orchard",{
				        		longitude: sessionStorage.getItem("lng"),
				        		latitude: sessionStorage.getItem("lat"),
				        		city:"青岛市",
				        		page: that.page
					        },config).then(res => {
					        	if(res.data.code == 0){
					        		that.picklist = res.data.data;
					        	}
					        })
						}else{
							axios.post("/index/orchard",{
				        		longitude: '120.369557',
				        		latitude: '36.094406',
				        		city:"青岛市",
				        		page: that.page
					        },config).then(res => {
					        	if(res.data.code == 0){
					        		that.picklist = res.data.data;
					        	}
					        })
						}
				    }*/
				}
				
			}
			
			
			
		},
		methods:{
			scroll(el){
				this.top = el.scrollTop;
				var that = this;
				if(this.lock){
					if(this.height + el.scrollTop >= el.children[0].offsetHeight){
						this.lock = false;
						this.isLoading = true;
						var page = that.page;
						page++;
						that.page = page;
						axios.post("/index/orchard",{
							longitude:sessionStorage.getItem('lng'),
							latitude:sessionStorage.getItem('lat'),
							city:"青岛市",
							page: that.page
						},config).then(res => {
							if(res.data.code == 0){
								if(res.data.data.length == 0){
									this.isShow = true;
								}else{
									var list = that.picklist;
									this.picklist = list.concat(res.data.data);
									this.lock = true;
								}
								this.isLoading = false;
							}
						})
						
					}
				}
			}
		},
		props:{
			'height':Number
		},
		deactivated(){
			sessionStorage.setItem("pickTop",this.top);
		}
	}
</script>

<style>
</style>