
var headers = {
	"appid": 1,
    "deviceid": "985ff090eb761e8329c64092ac421adf9afe3",
    "channelid": "WX",
    "UserAgent": "WX",
    "productid": 1,
    "userid": '',
    "usertoken": ''
}

export default{
  // 基础url前缀
  baseURL: 'http://ws.tianmaoetong.com',
　　
　　　　
  transformRequest: [function (data) {
  	var html = "";
  	for(var item in data){
  		html += item + "=" + data[item] + "&";
  	}
  	data = html.substring(0,html.length - 1);
    return data;
  }],

  transformResponse: [function (data) {
    // 这里提前处理返回的数据

    return data;
  }],

  // 请求头信息
  headers:headers,

  //返回数据类型
  responseType: 'json', // default

 
}