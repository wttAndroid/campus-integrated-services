import store from './index.js'

 class socketIO {
	constructor() {
	  this.socketTask = null //实例
	  this.connectId = null //实例
	  this.is_open_socket = false //避免重复连接
	  this.url = 'ws://123.56.144.92:8883?connectId='+this.connectId
	  this.connectNum = 1 // 重连次数
	  //心跳设置
	  this.timeout = 15000,
	  this.heartbeatInterval = null //检测服务器端是否还活着
	  this.reconnectTimeOut = null //重连之后多久再次重连
	  this.followFlake=false   //是否属于正常关闭
	}
	connectSocketInit(connectId){ //初始化数据
		this.connectId = connectId;
		this.url = 'ws://123.56.144.92:8883?connectId='+this.connectId
		this.socketTask = uni.connectSocket({
			url: this.url,
			success: () => {
				console.log("---建立(websocket)-----")
					//登录成功  获取该用户所有信息
				store.dispatch('m_chat/getchatlist',this.connectId)
				    // 返回实例
				return this.socketTask
			},
		});
		this.socketTask.onOpen((res)=>{ //用户上线
			console.log(this.connectId+"用户上线---------")
			this.connectNum = 1;
			// this.send(data) //发送我上线的消息 这里取消因为connectSocket已经触发过了一次
			
			//清除心脏跳动
			clearInterval(this.reconnectTimeOut)
			clearInterval(this.heartbeatInterval)
			//开启连接
			this.is_open_socket = true;
			this.start();
			
			// 这里：只有连接正常打开中，才能正常收到消息
			this.socketTask.onMessage(({data}) => {
				let params=JSON.parse(data);
					if(params.type==2){ //有用户退出和登录：显示当前在线的用户有多少
						store.dispatch('m_chat/online',params.data);
					}
				//收到信息重新获取数据
				store.dispatch('m_chat/getchatlist',this.connectId)
			})
		})
	
			// 这里仅是事件监听【如果socket关闭了会执行】
		this.socketTask.onClose(() => {
			console.log("掉线-------")
			clearInterval(this.heartbeatInterval)
			clearInterval(this.reconnectTimeOut)
			this.is_open_socket = false;
			this.socketTask = null
			if (this.connectNum < 3) { //试图重新连接3次
				this.reconnect();
			} else {
				this.connectNum = 1
			}
		})
	}
	// 主动关闭socket连接
	Close() {
		if (!this.is_open_socket) { //已经关闭就不关闭
			return
		}
		console.log("准备关闭",this.followFlake);
		this.followFlake=true;
		this.socketTask.close({
			success() {
				console.log("---断开(主动断开)-----")
			}
		})
	};

	
	//发送消息
	send(data) {
			// 注：只有连接正常打开中 ，才能正常成功发送消息
		if (this.socketTask) {
			// uni.sendSocketMessage({
			// data:JSON.stringify(data)
			// })
			this.socketTask.send({
					data: JSON.stringify(data),
					async success() {
						console.log("---消息(发出)-----")
					},
			});	
				
		}
	}
		
	//开启心跳检测
	start() {
		this.heartbeatInterval = setInterval(() => {
			this.send({
				data:0 //这里发一条没有价值的信息是为了保持连接
			});
		}, this.timeout)
	}

//重新连接
	reconnect() {
		//停止发送心跳
		clearInterval(this.heartbeatInterval)
		console.log(this.is_open_socket,this.followFlake)
		//如果不是人为关闭的话，5秒后进行重连一次
		if (!this.is_open_socket && !this.followFlake) {
			this.reconnectTimeOut = setInterval(() => {
				console.log("---重连(自动断开)-----")
				this.connectSocketInit(this.connectId);
			}, 5000)
		}
	}

}


module.exports = socketIO
// function init(connectId){
// 	var heartbeatInterval=null; //检测服务器是否连接
// 	var is_open_socket =false;//避免重复连接
	
// 	if(!uni.$socket){
// 		uni.$socket=uni.connectSocket({
// 			url:'ws://123.56.144.92:8883?connectId='+connectId,
// 			success:(e)=>{
// 				//登录成功  获取该用户所有信息
// 				store.dispatch('m_chat/getchatlist',connectId)
// 			},
// 			fail:(e)=>{
// 				console.log(e)
// 			}
// 		})
// 		//用户打开
// 		uni.$socket.onOpen((res)=>{
// 			console.log("我要上线了"+connectId);
			
// 			//开启检测
// 			clearInterval(heartbeatInterval)
// 			is_open_socket = true;
// 			start()
// 		})
// 		uni.$socket.onMessage(function({data}){
// 			let params=JSON.parse(data);
// 			if(params.type==2){ //当前在线的用户有多少
// 				store.dispatch('m_chat/online',params.data);
// 			}
// 			//收到信息重新获取数据
// 			store.dispatch('m_chat/getchatlist',connectId)
// 		})
// 		uni.$socket.onClose(function(res){
// 			console.log("我要下线了"+connectId);
// 			reconnect();
// 		})
// 	}
	
// 	function start(){
// 		console.log("开始心脏跳动----")
// 		heartbeatInterval = setInterval(() => {
// 			console.log("发送消息----")
// 			uni.sendSocketMessage({
// 				data:0
// 			})
// 		}, 15000)
// 	}
	
// 	function reconnect(){ //重新连接
// 	console.log("重新连接-----")
// 		//停止发送心跳
// 		clearInterval(heartbeatInterval)
// 		//如果不是人为关闭的话，进行重连
// 		if (!is_open_socket) {
// 			uni.$socket=uni.connectSocket({
// 				url:'ws://123.56.144.92:8883?connectId='+connectId,
// 				success:(e)=>{
// 					//登录成功  获取该用户所有信息
// 					store.dispatch('m_chat/getchatlist',connectId)
// 				},
// 				fail:(e)=>{
// 					console.log(e)
// 				}
// 			})
// 		}
// 	}
// }