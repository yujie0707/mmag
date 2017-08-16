<template>
	<div id="searchAddress">
		<header>
			<img src="/dist/image/search/return.png" @click="goback()" />
			<input type="text" v-model="search" placeholder="小区/写字楼/路名" />
			<img src="/dist/image/search/searchhui.png"/>
		</header>
		<ul>
			<li v-for="item in list" @click="change(item.address,item.district,item.location.lng,item.location.lat)">
				<p>{{item.name}}</p>
				<p>（{{item.address}}）</p>
			</li>
		</ul>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				search:"",
				list:[]
			}
		},
		watch:{
			"search":function(){
				if(this.search == ""){
					return;
				}
				var that = this;
				AMap.service(["AMap.Autocomplete"], function() { 
	               	//实例化城市查询类 
	               	var autoOptions = {
				        city: "青岛", //城市，默认全国
				        citylimit: true
				    };
				    var autocomplete = new AMap.Autocomplete(autoOptions);
				    autocomplete.search(that.search, function(status, result){
					    //TODO:开发者使用result自己进行下拉列表的显示与交互功能
					    if(status == "complete"){
					    	for(var i = result.tips.length - 1; i >= 0; i--){
					    		if(result.tips[i].address.toString() == ""){
					    			result.tips.splice(i,1);
					    		}
					    	}
					    	that.list = result.tips;
					    	console.log(that.list);
					    }
					    
					});
	           	});
			}
		},
		methods:{
			change(address,district,lng,lat){
				this.$parent.$refs.one.lng = lng;
				this.$parent.$refs.one.lat = lat;
				this.$parent.$refs.one.plot = address;
				this.$parent.show = true;
				this.search = "";
				this.list = [];
			},
			goback(){
				this.$parent.show = true;
				this.search = "";
				this.list = [];
			}
		}
	}
</script>

<style>
</style>