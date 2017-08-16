'use strict';

var Reducer = (state={carNum:0,order:{},pay:[],yes:[],send:[],refund:[],all:[],complete:[],weixin:{}}, action={})=>{
	switch(action.type){
		case 'NUM':
			state.carNum = action.context;
			return state;
		case "ORDER":
			state.order = action.context;
			return state;
		case "PAY":
			state.pay = action.context;
			return state;
		case "YES":
			state.yes = action.context;
			return state;
		case "SEND":
			state.send = action.context;
			return state;
		case "REFUND":
			state.refund = action.context;
			return state;
		case "ALL":
			state.all = action.context;
			return state;
		case "COMPLETE":
			state.complete = action.context;
			return state;
		case "WEIXIN":
			state.weixin = action.context;
			return state;
		default:
			return state;
	}
}

export default Reducer;

