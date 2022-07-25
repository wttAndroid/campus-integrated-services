
export default {
	namespaced:true,
	state:()=>({
		token:JSON.parse(uni.getStorageSync('token')||'{}'),
		user:JSON.parse(uni.getStorageSync('user')||'{}')
	}),
	mutations:{
		_savetoken(state,userinfostr){
			uni.setStorageSync('token',JSON.stringify(userinfostr))
			state.token=userinfostr||{}
		},
		_saveUser(state,userstr){ 
			uni.setStorageSync('user',JSON.stringify(userstr));
			state.user=userstr||{}
		},
		_exit(state){
			state.user=null
			state.token=null
		}
	},
	actions:{
		async savetoken({commit,dispatch},userinfo){
			// console.log(userinfo)
			//保存该用户信息
			commit('_savetoken',{uid:userinfo.uid,tokenn:'Bearer '+userinfo.token})
			//该用户上线
			commit('m_chat/_login_socket',userinfo.uid,{root:true}) //同时加载该用户的班级信息
			await dispatch('saveUser',userinfo.user) //同时加载该用户的班级信息
			
		},
		 async saveUser({commit},userstr){
			commit('_saveUser',userstr)
		},
		exit({commit}){
			commit('m_chat/_exit',{},{root: true});
			commit('_exit');
			uni.clearStorage();
			
		}
	}
}