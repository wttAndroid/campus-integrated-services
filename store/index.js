import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import moduleUser from './user.js'
import moduleChat from './chat.js'

const store=new vuex.Store({
	modules:{
		m_user:moduleUser,
		m_chat:moduleChat
	}
})

// console.log(store.dispatch)
export default store