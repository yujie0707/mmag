<template>
	<div id="subhome-header" class="clear">
		<div class="subhome-header-city" @click="show()">
			<span>{{city}}</span>
			<img src="/dist/image/home/subhome/dizhi.png" />
		</div>
		<div class="subhome-header-title">妈妈爱果</div>
		<v-search></v-search>
		<div id="city" v-if="isshow" :style="{height:height + 'px'}">
			<div id="bottom">
				<header>
					<span class="cancle" @click="miss()">取消</span>
					<span class="city-choose">城市选择</span>
					<span class="back" @click="yes()">确定</span>
				</header>
				<div class="city">
					<ul>
						<li :class="provinceindex == index ? 'active' : ''" v-for="(item,index) in provincelist" @click="tocity(index)">{{item.proname}}</li>
					</ul>
					<ul>
						<li :class="cityindex == index ? 'active' : ''" v-for="(item,index) in citylist" @click="toarea(index)">{{item.cityname}}</li>
					</ul>
					<ul>
						<li :class="areaindex == index ? 'active' : ''" v-for="(item,index) in arealist" @click="area(index)">{{item.cityname}}</li>
					</ul>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	import Search from "../search.vue";
	import config from "../../config/config.js";
	export default{
		components:{
			"v-search":Search,
		},
		data(){
			return{
				city:"青岛市",
				provincelist:[],
				citylist:[],
				arealist:[],
				isshow:false,
				height: document.body.offsetHeight,
				provinceindex:0,
				cityindex:0,
				areaindex:0
			}
		},
		mounted(){
			var that = this;
			if(sessionStorage.getItem("city")){
				this.city = sessionStorage.getItem("city");
			}else{
				/*AMap.service(["AMap.CitySearch"], function() { 
	               //实例化城市查询类 
	               var citysearch = new AMap.CitySearch(); 
	               //自动获取用户IP，返回当前城市 
	               citysearch.getLocalCity(function(status, result){ 
	                   if(status === 'complete' && result.info === 'OK'){ 
	                       if(result && result.city && result.bounds) { 
	                           that.city = result.city;
	                       } 
	                   }
	               }); 
	           	}); */
	           	/*wx.ready(function(){
		           	wx.getLocation({
					    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					    success: function (res) {
					    	alert(JSON.stringify(res));
					        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
					        var speed = res.speed; // 速度，以米/每秒计
					        var accuracy = res.accuracy; // 位置精度
					    }
					});
				});*/
	           	
			}
			axios({
				method:"get",
				url:"/dist/source/city.json"
			}).then(res => {
				this.provincelist = res.data.data.list;
				this.citylist = res.data.data.list[0].citys;
				this.arealist = res.data.data.list[0].citys[0].areas;
			})
		},
		methods:{
			miss(){
				this.isshow = false;
			},
			show(){
				this.isshow = true;
			},
			tocity(index){
				this.citylist = this.provincelist[index].citys;
				this.arealist = this.citylist[0].areas;
				this.provinceindex = index;
				this.cityindex = 0;
				this.areaindex = 0;
			},
			toarea(index){
				this.arealist = this.citylist[index].areas;
				this.cityindex = index;
				this.areaindex = 0;
			},
			area(index){
				this.areaindex = index;
			},
			yes(){
				config.headers.userid = sessionStorage.getItem("userid");
				config.headers.usertoken = sessionStorage.getItem("usertoken");
				this.city = this.citylist[this.cityindex].cityname;
				this.isshow = false;
				sessionStorage.setItem("city",this.citylist[this.cityindex].cityname);
				sessionStorage.setItem('lng',this.arealist[this.areaindex].lng);
				sessionStorage.setItem('lat',this.arealist[this.areaindex].lat);
				this.$parent.$refs.pick.isLoading = false;
				this.$parent.$refs.pick.isShow = false;
				this.$parent.$refs.pick.lock = true;
				this.$parent.$refs.pick.page = 1;
				axios.post("/index/orchard",{
	        		longitude: sessionStorage.getItem("lng"),
	        		latitude: sessionStorage.getItem("lat"),
	        		city:"青岛市",
	        		page: 1
		        },config).then(res => {
		        	if(res.data.code == 0){
		        		this.$parent.$refs.pick.picklist = res.data.data;
		        	}
		        })
			}
		}
	}
</script>

<style>
</style>