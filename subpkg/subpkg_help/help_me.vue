<template>
	<view>
					<view class="uni-padding-wrap uni-common-mt">
						<uni-segmented-control :current="type" :values="items" style-type="button"
							active-color="#007aff" @clickItem="onClickItem" />
					</view>
					<view class="task-content" v-if="tasklist&&tasklist.length">
						<view class="task_item-wrap" v-for="item in tasklist" :key="item.id" @click="navigateTo(item.id)">
							<view class="iconfont icon-icon_biaoji chai" v-if="item.state!=0"></view>
							<view class="iconfont icon-yiguoqi guoqi" v-if="item.state==0&&isguoqi(item.end_time)"></view>
							<view class="task-user">
								<image :src="thumbnail(item.user_pic)" mode="widthFix"></image>
								<view class="center">
										<view>{{item.username}}</view>
										<view class="hover">{{item.start_time}}</view>
								</view>
								<view class="money">
									￥{{item.money}}
								</view>
							</view>
							<view class="task-info">
								<view class="help-info-title">
									<view class="iconfont icon-icon_laba_3" style="color: #55aaff;" ></view>
									<text class="help-title">{{item.title}}
									</text>
								</view>
								<view class="help-info-item">
									<view class="iconfont icon-icon_haoyou" style="color: #aaaa7f;" ></view>
									<text class="info-left">联系人：</text>
									<text class="info-right">{{item.task_contact}}</text>
								</view>
								<view class="help-info-item">
									<view class="iconfont icon-icon_dingwei" style="color: #aaaa7f;" ></view>
									<text class="info-left">地址：</text>
									<text class="info-right">{{task_address(item.task_address)}}</text>
								</view>
								<view class="help-info-item">
									<view class="iconfont icon-a-icon_riliricheng" style="color: #aaaa7f;" ></view>
									<text class="info-left">时间：</text>
									<text class="info-right">{{item.task_time}}</text>
								</view>
								<view class="help-info-item">
									<view class="iconfont icon-icon_VIP" style="color: #aaaa7f;" ></view>
									<text class="info-left">备注：</text>
									<text class="info-right">{{item.task_remark}}</text>
								</view>
								<view class="help-info-item">
									<view class="iconfont icon-icon_daojishi" style="color: #ff0000;" ></view>
									<text class="info-left">
										剩余时间：</text>
									<text class="info-right">{{close_date(item.end_time)}}</text>
								</view>
							</view>

						</view>
					</view>
					<block v-else>
						<view style="margin-top: 100rpx; text-align: center;">
							<image style="width: 400rpx;" src="http://123.56.144.92:8883/none2.png" mode="widthFix"></image>
							<view>暂时什么都没有....</view>
						</view>
					</block>
					
					<!-- <view class="content">
						<block v-if="tasklist&&tasklist.length">
							<uni-card v-for="item in tasklist" :key="item.id" :title="item.username"  :extra="extraState(item.state)" :thumbnail="thumbnail(item.user_pic)" @click="gotoitem(item.id)">
								<view class="uni-body">
									<view class="help-info-title">
										<view class="iconfont icon-icon_laba_3" style="color: #55aaff;" ></view>
										<text class="help-title">{{item.title}}
										</text>
										<text class="help-money">￥{{item.money}}</text>
									</view>
									<view class="help-info-item">
										<view class="iconfont icon-icon_haoyou" style="color: #aaaa7f;" ></view>
										<text class="info-left">联系人：</text>
										<text class="info-right">{{item.task_contact}}</text>
									</view>
									<view class="help-info-item">
										<view class="iconfont icon-icon_dingwei" style="color: #aaaa7f;" ></view>
										<text class="info-left">地址：</text>
										<text class="info-right">{{task_address(item.task_address)}}</text>
									</view>
									<view class="help-info-item">
										<view class="iconfont icon-a-icon_riliricheng" style="color: #aaaa7f;" ></view>
										<text class="info-left">时间：</text>
										<text class="info-right">{{item.task_time}}</text>
									</view>
									<view class="help-info-item">
										<view class="iconfont icon-icon_VIP" style="color: #aaaa7f;" ></view>
										<text class="info-left">备注：</text>
										<text class="info-right">{{item.task_remark}}</text>
									</view>
									<view class="help-info-item">
										<view class="iconfont icon-icon_daojishi" style="color: #ff0000;" ></view>
										<text class="info-left">
											剩余时间：</text>
										<text class="info-right">{{close_date(item.end_time)}}</text>
									</view>
								</view>
							</uni-card>
						</block> -->
		<!-- </view> -->
		
	</view>
</template>

<script>
	import { mapState} from 'vuex'
	export default {
		data() {
			return {
				items: ['我发布的任务', '我接收的任务'],
				type:0,
				pagenum :0,
				total:0,
				tasklist:[],
			};
		},
		computed:{
			...mapState('m_user',['token']),
			isguoqi(){
				return function(endtime){
					let end=new Date(endtime);
					return new Date()>end;
				}
			},
			extraState(){
				return function(state){
					if(state==-1) return '已关闭'
					if(state==0) return '待接单'
					if(state==1) return '待支付'
					if(state==2) return '已支付' 
					if(state==3) return '已完成' 
				}
			},
			thumbnail(){
				return function(user_pic){
					return uni.$http.baseUrl+user_pic;
				}
			},
			task_address(){
				return function(address){
					return JSON.parse(address)['name']
				}
			},
			close_date(){
				return function(date){
					//截至当前时间
				return new Date(date).countdown()
				}
			}
		},
		methods:{
			init(){
				this.pagenum=0,
				this.tasklist=[],
				this.total=0
			},
			onClickItem(e){
					if (this.type !== e.currentIndex) {
						this.type = e.currentIndex
					}
					this.init();
					this.gettask();
			},
			async gettask(callback=null){
				let uid=this.token.uid;
				if(this.pagenum*10>this.total)return uni.$showMsg('已经到底了');
				this.pagenum+=1
				let {data}=await uni.$http.get('/api/task/getbyw?uid='+uid+"&type="+(this.type+1)+"&pagenum="+this.pagenum);
				if(data.code!=200) return uni.$showMsg(data.message);
				this.tasklist=[...this.tasklist,...data.data['list']]
				this.total=data.data['total'];
				callback&&callback()
			},
			navigateTo(id){
				uni.navigateTo({
					url:"./help_detai?id="+id
				})
			}
		},
		onLoad(){
			this.gettask();
		},
		onReachBottom(){
			this.gettask();
		}
	}
</script>

<style lang="scss">
	.uni-common-mt {
			margin-top: 10px;
		}
		.uni-padding-wrap {
			// width: 750rpx;
			padding: 0px 30px;
		}
		
	// .content{
	// 	margin-top: 30rpx;
	// }
	// .help-info-title{
	// 	font-size: $uni-font-size-subtitle;
	// 	font-weight: bold;
	// 	margin-bottom: 20rpx;
	// 	.help-money	{
	// 		float: right;
	// 		color: red;
	// 	}
	// }
	// .help-info-item{
	// 	height: 50rpx;
	// 	line-height: 50rpx;
	// 	.info-left{
	// 		color: $uni-text-color-grey;
	// 	}
	// }
	page{
		background-color: $uni-theme-bg-basec;
	}
	.task-content{
		padding: 20rpx;
	}
	.task_item-wrap{
		position: relative;
		background: $uni-bg-color;
		padding: 20rpx;
		box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		.chai,.guoqi{
			font-size: 200rpx;
			position: absolute;
			right: 10px;
			bottom: 20%;
			color: $uni-text-color-grey;
			z-index: 1;
		}
		.guoqi{
			color: #795548;
		}
		.task-user{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.center{
				text-align: left;
				flex: 1;
				overflow: hidden;
				margin: 0rpx 10rpx;
				.hover{
					font-size: 20rpx;
					color: $uni-text-color-grey;
				}
			}
			image{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}
			.money{
				color:red;
				font-weight: bold;
				font-size: 30rpx;
			}
		}
		.task-info{
			padding: 30rpx;
			overflow: hidden;
		}
	}
	
</style>
