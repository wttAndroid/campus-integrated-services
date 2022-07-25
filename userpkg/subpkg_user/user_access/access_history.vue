<template>
	<view>
		<block v-if="historylist&&historylist.length">
			<view class="history-item" v-for="item in historylist" :key="item.id">
				<view class="history-user">
					<uni-icons class="icon" type="contact" size="20"></uni-icons>
					<text>{{item.access_name}}</text> <text :class="['tag',gettag(item.state)]">{{gettagtext(item.state)}}</text>
				</view>
				<view class="history-cont">
					<view class="class">{{gettype(item.type)}}</view>
					<view class="hover">时间段：{{item.enter_date}} {{item.out_date}}</view>
					<view class="hover">缘由：{{item.reason}}</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view style="margin-top: 100rpx; text-align: center;">
				<image style="width: 400rpx;" src="http://123.56.144.92:8883/none2.png" mode="widthFix"></image>
				<view>暂时什么都没有....</view>
			</view>
		</block>
	</view>
</template>

<script>
	import  '@/utils/utils.js'
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				historylist:[]
			};
		},
		computed:{
				...mapState('m_user',['token']),
				gettag(){
					return function(state){
						if(state==0)return ''
						if(state==1)return 'pass'
						if(state==2)return 'reject'
						if(state==3)return 'check'
					}
				},
				gettagtext(){
					return function(state){
						if(state==0)return '未审批'
						if(state==1)return '同意'
						if(state==2)return '拒绝'
						if(state==3)return '已使用'
					}
				},
				gettype(type){
					return function(type){
						if(type==1)return '出校'
						if(type==2)return '入校'
						if(type==3)return '出入学校'
						if(type==4)return '入出学校'
					}
				},
		},
		methods:{
			async getHistory(){
				let {data}=await uni.$http.post('/api/access/history/get',{uid:this.token.uid});
				if(data.code!=200)return uni.$showMsg(data.message);
				
				this.historylist=data.data.map(item=>{
					item['enter_date']=(item.enter_date&&new Date(item.enter_date).Format())||'';
					item['out_date']=(item.out_date&&new Date(item.out_date).Format())||''
					return item
				})
			}
		},
		onLoad() {
			this.getHistory();
		}
	}
</script>

<style lang="scss">
	page{
		background-color: $uni-theme-bg-basec;
	}
	.history-item{
		background-color: #fff;
		padding: 30rpx;
		margin: 20rpx;
		border-radius: $uni-border-radius-base;
		.history-user{
			&>.icon{
				vertical-align: middle;
			}
			&>.tag{
				border: 1rpx solid #ff5500;
				color: #ff5500;
				background-color: #fff4f2;
				border-radius: 40rpx;
				font-size: 20rpx;
				padding: 5rpx;
				margin-left: 8rpx;
				vertical-align: middle;
				&.pass{
					border: 1rpx solid #38dc3f;
					color: #fff4f2;
					background-color: #38dc3f;
					
				}
				&.check{
					border: 1rpx solid #E91E63;
					color: #fff4f2;
					background-color: #E91E63;
				}
				&.reject{
					color: #fff4f2;
					border: 1rpx solid #ff5500;
					background-color: #ff5500;
				}
			}
		}
		.history-cont{
			margin-top: 10rpx;
			&>.class{
				color: #333;
				font-size: $uni-font-size-base;
			}
			&>.hover{
				color:$uni-text-color-grey;
				font-size: $uni-font-size-sm;
			}
		}
	}
</style>
