<template>
	<view style="height: 100%;position: relative;">
		<block v-if="userlist&&userlist.length">
			<uni-indexed-list  @refresher="onRefresh" :options="userlist" :showSelect="false" @click="bindClick"></uni-indexed-list>
		</block>
		<block v-else>
			<view style="text-align: center;padding-top: 100rpx;">
				<image style="width: 350rpx;" src="http://123.56.144.92:8883/none2.png" mode="widthFix"></image>
				<view style="color: grey;">暂无好友~ 快去邀请其他同学吧~</view>
			</view>
		</block>
	</view>
</template>

<script>
	import {groupBydesc} from '@/utils/tools.js'
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				userlist:[]	
			};
		},
		computed:{
			...mapState('m_user',['token']),
			...mapState('m_chat',['linelist']),
			filepicker(){
				return (photo)=>{
					return uni.$http.baseUrl+photo
				}
			},
		},
		watch:{
			linelist:{
				handler:function(){
					this.getuserlist();
				},
				deep:true
			}
		},
		methods:{
			onRefresh() {
				this.getuserlist()
			},
			gotoUserPage(id){
				uni.navigateTo({
					url:"/chatpkg/chatpkg_user/chatpkg_user?id="+id
				})
			},
			async getuserlist(callback){
				let that=this;
				if((!this.token)||(!this.token.uid))return this.userlist=[];
				let {data}=await uni.$http.get('/api/chat/address/get?uid='+this.token.uid);
				if(data.code!=200)return;
				let datas=data.data&&data.data.map(item=>{
					item.state=that.linelist&&that.linelist.indexOf(item.uid);
					return item
				})
				this.userlist=datas&&groupBydesc(datas);
				
				callback&&callback()
			},
			async requestGroup(datas){
				let {data}=await uni.$http.post('/api/chat/address/group',datas);
				if(data.code!=200)return;
				 this.userlist=data.data;
			},
			bindClick(obj){
				// console.log(obj);
				this.gotoUserPage(obj.uid)
			}
		},
		onLoad() {
			this.getuserlist()
		}
	}
</script>

<style lang="scss">
	page{
		background-color: $uni-theme-bg-basec;
		height: 100%;
	}
	// .user-list{
	// 	padding: 0 25rpx;
	// 	.group_wrap-item{
	// 		.letter{
	// 			    color: grey;
	// 			    margin-left: 20rpx;
	// 			    height: 60rpx;
	// 			    line-height: 60rpx;
	// 		}
	// 		.user-item-wrap{
	// 			background-color: #fff;
	// 			border-radius: 20rpx;
	// 			box-shadow: 0rpx 1rpx 10rpx 5rpx #f0f0f0;
	// 			.user-item{
	// 				display: flex;
	// 				padding: 40rpx;
	// 				align-items: center;
	// 				border-bottom: 1rpx solid #f1f1f1;
	// 				.user-img{
	// 						width: 80rpx;
	// 						height: 80rpx;
	// 						position: relative;
	// 						&>image{
	// 							width: 100%;
	// 							height: 100%;
	// 							border-radius: 50%;
	// 						}
	// 						&::after{
	// 							content: '';
	// 							position: absolute;
	// 							bottom: 0;
	// 							right: 0;
	// 							width: 20rpx;
	// 							height: 20rpx;
	// 							border-radius: 50%;
	// 							background-color: #55ff17;
	// 						}
	// 					}
	// 					.user-name{
	// 						margin-left: 20rpx;
	// 					}
	// 					.user-phone{
	// 						margin-left: 10rpx;
	// 						color: $uni-text-color-grey;
	// 					}
						
	// 			}
	// 		}
	// 	}
		
	// }
</style>
