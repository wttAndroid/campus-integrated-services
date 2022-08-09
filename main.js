import Vue from 'vue'
import App from './App'
import {$http} from '@escook/request-miniprogram'
import store from './store/index.js'


Vue.config.productionTip = false

uni.$http=$http;


// uni.$http.baseUrl='http://127.0.0.1:8883'//http://123.56.144.92:8883';
uni.$http.baseUrl='http://123.56.144.92:8883'//http://123.56.144.92:8883';


$http.beforeRequest=function(options){
	//包含chat就不需要弹出
	// if(options.url.indexOf('/get')!=-1&&options.url.indexOf('/chat/')==-1){
	// 	uni.showLoading({
	// 		title:'数据加载中'
	// 	}); 
	// }
	
	
	$http.optionsurl=options.url;
	if(options.url.indexOf('/user/')==-1){
		options.header={
			Authorization:(store.state.m_user.token&&store.state.m_user.token.tokenn)||''
		}
	}
}
var model=true;
$http.afterRequest=function(res){
	//token过期   或者 soket不存在且不是登录页
	if((res.data.code==401&&res.data.msg=='Authentication Error')||(!(uni.$socketIo&&uni.$socketIo.socketTask)&&$http.optionsurl.indexOf('/user/')==-1)){
	// if((res.data.code==401&&res.data.msg=='Authentication Error')||(!(uni.$socket)&&$http.optionsurl.indexOf('/user/')!=-1)){
		if(model){
			model=false;
			uni.showModal({
				title:'您的登录已过期，请重新登录！',
				showCancel:false,
				success() {
					uni.redirectTo({url:"/subpkg/subpkg_login/subpkg_login"});
				},
				complete() {
					model=true;
				}
			})
		}
	}
}


uni.$showMsg=function(title='数据加载失败'){
	uni.showToast({
		title,
		duration:1500,
		icon:'none'
	})
}



App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount() 
 