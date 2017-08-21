import Vue from 'vue'
import App from './App.vue'
import VueLazyload from "vue-lazyload"


import Login from "./js/login/login.vue";
import Home from "./js/home/home.vue";
import subHome from "./js/home/subhome/subhome.vue";
import subClassify from "./js/home/classify/classify.vue";
import subShopping from "./js/home/shopping/shopping.vue";
import subMy from "./js/home/my/my.vue";
import Detail from "./js/detail/detail.vue";
import Pick from "./js/pick/pick.vue";
import Search from "./js/search/search.vue";
import Order from "./js/order/order.vue";
import Pickorder from "./js/order/pickorder.vue";
import payWrap from "./js/weixin/payWrap.vue";
import A from "./js/collect/collect.vue";
import Allorder from "./js/allorder/allorder.vue";
import Address from "./js/address/address.vue";
import Addaddress from "./js/addAddress/comble.vue";
import Talking from "./js/talking/talking.vue";
import Orderdetail from "./js/orderdetail/orderdetail.vue";
import Editmy from "./js/editmy/editmy.vue";
import Talkingnow from "./js/talkingnow/talkingnow.vue";
import Refund from "./js/refund/refund.vue";
import Coupon from "./js/coupon/coupon.vue";

import './scss/total.scss';

Vue.use(VueRouter);

Vue.use(VueResource);
Vue.use(VueLazyload,{
	loading: '/dist/image/loading.png',
	error: "/dist/image/error.png"
})

axios.defaults.baseUrl = "http://www.tianmaoetong.com:5555";

var routes = [{
	path:"/",
	name:"login",
	component:Login
},{
	path:"/home",
	name:'home',
	component:Home,
	children:[{
		path:"/home/",
		component:subHome
	},{
		path:"/home/classify",
		component:subClassify
	},{
		path:"/home/shopping",
		component:subShopping
	},{
		path:"/home/my",
		component:subMy
	}]
	
},{
	path:"/detail/:id",
	name:"detail",
	component:Detail
},{
	path:"/pick/:id/:goodLevel/:distance",
	name:"pick",
	component:Pick
},{
	path:"/search",
	name:"search",
	component:Search
},{
	path:"/order/:address",
	name:"order",
	component:Order
},{
	path:"/pickorder",
	name:"pickorder",
	component:Pickorder
},{
	path:"/weixin",
	name:"weixin",
	component:payWrap
},{
	path:"/collect",
	name:"collect",
	component:A
},{
	path:"/allorder",
	name:"allorder",
	component:Allorder
},{
	path:"/address",
	name:"address",
	component:Address
},{
	path:"/addAddress",
	name:"addAddress",
	component:Addaddress
},{
	path:"/talking/:catid",
	name:"talking",
	component:Talking
},{
	path:"/orderdetail/:detail",
	name:"orderdetail",
	component:Orderdetail
},{
	path:"/editmy/:img/:phone",
	name:"editmy",
	component:Editmy
},{
	path:"/talkingnow/:catid/:img/:orderid",
	name:"talkingnow",
	component:Talkingnow
},{
	path:"/refund/:data",
	name:"refund",
	component:Refund
},{
	path:"/coupon/:type/:money",
	name:"coupon",
	component:Coupon
}];

var router = new VueRouter({
	routes:routes
})

new Vue({
  el: '#app',
  
    router:router,
    render: h => h(App),
	watch:{
		"$route":function(){
			var path = this.$route.path;
			switch (path){
				case "/home":
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
	}
})
Vue.prototype.setCookie = function(name,value,day){
	var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*day);
    window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}
Vue.prototype.getCookie = function(name){
	var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}
Vue.prototype.removeCookie = function(name){
	this.set(name, '', -1);
}


