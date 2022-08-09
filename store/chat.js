
// import store from './index.js'
 
// function init(connectId){
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
// 		})
// 	}
// }
import socketIO from '@/store/socket.js'
uni.$socketIo = new socketIO()


const chat={
	namespaced:true,
	state:()=>({
		chatlist:{},
		linelist:[]
	}),
	mutations:{
		_login_socket(state,data){
			// init(data);
			if(!uni.$socketIo)uni.$socketIo = new socketIO()
			uni.$socketIo.connectSocketInit(data)
		},
		_receiveMsg(state,data){
			state.chatlist=data
		},
		_online(state,data){
			state.linelist=data
		},
		_exit(state){
			state.chatlist={}
			state.linelist=[]
			uni.$socketIo.Close();
			uni.$socketIo=null
		}
	},
	actions:{	
		receiveMsg(context,payload){
			context.commit('_receiveMsg',payload)
		},
		async getchatlist(context,uid){ //重新加载近期消息数据：用户-聊天记录
			let {data}=await uni.$http.get('/api/chat/get?uid='+uid);
			if(data.code!=200)return uni.$showMsg(data.message);
			context.commit('_receiveMsg',data.data)
		},
		async getchatByprivate(context,uid,toid){ //获取该用户与某人
			// let {data}=await uni.$http.get('/chat/private/get?uid='+uid+"&toid="+toid);
			// if(data.code!=200)return uni.$showMsg(data.message);
			// let {data}=await uni.$http.get('/api/chat/get?uid='+uid);
			// if(data.code!=200)return uni.$showMsg(data.message);
			// store.dispatch('m_chat/receiveMsg',data.data)
			// chat.dispatch('receiveMsg',data.data)
		},
		sendMsg(context,payload){
			uni.$socketIo.send({
				data:payload 
			})
			// uni.sendSocketMessage({
			// 	data:payload
			// })
			context.dispatch('getchatlist',payload['from'])
		},
		async readMsg(context,payload){ 
			// let {data}=await uni.$http.post("/api/chat/read",{uid:payload.uid,from:payload.fromid});
			// if(data.code!=200)console.log("--读取了该消息--")
			// context.dispatch('getchatlist',payload.uid)
		},
		online(context,payload){
			console.log("--有人上线了--"+payload)
			context.commit('_online',payload)
		}
	},
	getters:{
		
	}
}

export default chat