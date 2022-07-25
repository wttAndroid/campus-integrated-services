<template>
	<view>
		<uni-list :border="true" v-if="lastMsglist&&lastMsglist.length">
		<!-- <uni-list-chat  title="uni-app" avatar="" note="您收到一条新的消息" time="2020-02-02 20:20" badge-positon="left" badge-text="dot"></uni-list-chat> -->
		<!-- 显示多头像 -->
		 <uni-list-chat  :clickable="true" v-for="item in lastMsglist" :key="item.id" @click="toNavigate(item.from_id,item.to_id)" :title="username(item.from_id,item.to_id)"   :avatar="userpick(item.from_id,item.to_id)" :note="item.ctype==1?'[语言]':item.content" :time="timeForm(item.create_time)" badge-positon="left" :badge-text="item.readcount"></uni-list-chat> 
		
		</uni-list>
		<block v-else>
			<view style="text-align: center;padding-top: 100rpx;">
				<image style="width: 350rpx;" src="http://123.56.144.92:8883/none2.png" mode="widthFix"></image>
				<view style="color: grey;">暂无对话~ 快去找兴趣相投的同学吧~</view>
			</view>
		</block>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import "@/utils/utils"
	export default {
		data() {
			return {
				avatarList:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png",
				lastMsglist:[],
				userList:{}
			};
		},
		computed:{
			...mapState('m_user',['token']),
			...mapState('m_chat',['chatlist']),
			timeForm(){
				return (str)=>{
					return new Date(str).Formatfiffer()
				}
			},
			userpick(){
				return function(fromid,toid){
					return uni.$http.baseUrl+this.userList[fromid==this.token.uid?toid:fromid].user_pic
				}
			},
			username(){
				return (fromid,toid)=>{
					return this.userList[fromid==this.token.uid?toid:fromid].username
				}
			},
			toChatpage(){
				return (fromid,toid)=>{
					let id=(fromid==this.token.uid?toid:fromid)
					return "/chatpkg/chatpkg_page/chatpkg_page?id=123"+id
				}
			}
		},
		watch:{
			chatlist:{
				handler:function(){
					console.log("更新聊天记录-----")
					this.getChatUserList()
				},
				deep:true
			}
		},
		onPullDownRefresh() {
			this.getChatUserList(function(){
				uni.stopPullDownRefresh();
			})
		},
		onLoad() {
			this.getChatUserList()
		},
		methods:{
			toNavigate(fromid,toid){
				uni.navigateTo({
					url:"/chatpkg/chatpkg_page/chatpkg_page?id="+(fromid==this.token.uid?toid:fromid)
				})
			},
			getChatUserList(callback){
				let msgObjlist={};
				let that=this;
				if(that.chatlist&&that.chatlist.chat){ //遍历所有聊天记录 根据私聊组合
					that.chatlist.chat.forEach(item=>{
						//计算阅读量：是发给我的，且是未读  添加一个阅读属性
						// console.log(item.to_id,that.token.uid,item.isread)
						if(item.to_id==that.token.uid&&item.isread==0){
							item['readcount']=1
						}else{
							item['readcount']=0
						}
						
						let chartid=item.chat_id;//获取私聊标签 以及已有的消息
						let lastmsg=msgObjlist[chartid];
						if(!lastmsg){//不存在存进去
							msgObjlist[chartid]=item; // 以chat_id进行分类
						}else{//已经存在则存储聊天记录
							let countSum=lastmsg.readcount+item.readcount
							if(item.create_time>lastmsg.create_time){
								msgObjlist[chartid]=item;
							}
							msgObjlist[chartid].readcount=countSum;
						}
					})
				}
				
				let lastMsg=Object.values(msgObjlist);
				lastMsg.sort(function(m1,m2){
					return m2.create_time>m1.create_time
				});
				
				
				this.$set(this,'userList',that.chatlist.users)
				this.$set(this,'lastMsglist',lastMsg)
				
				
				callback&&callback();
			}
		}
	}
</script>

<style lang="scss">
.chat-custom-right {
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-end;
}

.chat-custom-text {
	font-size: 12px;
	color: #999;
}

</style>
