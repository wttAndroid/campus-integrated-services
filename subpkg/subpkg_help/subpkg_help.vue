<template>
	<view style="overflow: hidden;">
	 <ren-dropdown-filter :filterData='filterData' :defaultIndex='defaultIndex'
		    @onSelected='onSelected'></ren-dropdown-filter>
			
			<view class="task-content" v-if="tasklist&&tasklist.length">
				<view class="task_item-wrap" v-for="item in tasklist" :key="item.id">
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
					<button type="primary" :disabled="item.state!=0||isguoqi(item.end_time)" @click="navigateTo(item.id)">查看订单</button>
				</view>
			</view>
			<block v-else>
				<view style="margin-top: 100rpx; text-align: center;">
					<image style="width: 400rpx;" src="http://123.56.144.92:8883/none2.png" mode="widthFix"></image>
					<view>暂时什么都没有....</view>
				</view>
			</block>
	<uni-fab ref="fab"  :content="content" horizontal="right" vertical="bottom" direction="vertical" @trigger="trigger"/>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				filterData:[
				      [{ text: '全部状态', value: null }, { text: '待接单', value: 0 }],
				       [{ text: '全部类型', value: null }, { text: '快递', value: 1 }, { text: '外卖', value: 2 }, { text: '排队', value: 3 }, { text: '其他', value: 4 }]
				 ],
					defaultIndex:[0,0],
				pagenum:0,
				params:{
					state:null,
					task_type:null,
				},
				tasklist:[],
				total:0,
				content: [{
						iconPath: '/static/icon/fabu.png',
						text: '发布',
						link:'./help_add'
					},
					{
							iconPath: '/static/icon/wode.png',
							text: '我的',
							link:'./help_me'
						}
				]
			};
		},
		computed:{
			isguoqi(){
				return function(endtime){
					let end=new Date(endtime);
					
					return new Date()>end;
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
		onLoad() {
			this.gettask()
		},
		methods:{
			onSelected(e){
				this.params['state']=e[0][0].value
				this.params['task_type']=e[1][0].value;
				this.init();
				this.gettask()
			},
			trigger(e){
					uni.navigateTo({url:this.content[e.index].link})
				},
			async gettask(callback){
				if(this.pagenum*10>this.total)return uni.$showMsg('已经到底了');
				this.pagenum+=1
				
				let url='/api/task/get?pagenum='+this.pagenum+('&state='+this.params['state'])+('&task_type='+this.params['task_type'])
				
				let {data}=await uni.$http.get(url);
				if(data.code!=200) return uni.$showMsg(data.message);
				this.tasklist=[...this.tasklist,...data.data['list']]
				this.total=data.data['total'];
				
				callback&&callback()
			},
			init(){
				this.pagenum=0,
				this.tasklist=[],
				this.total=0
			},
			navigateTo(id){
				uni.navigateTo({
					url:"./help_detai?id="+id
				})
			}
		},
		onReachBottom(){
			this.gettask()
		},
		onPullDownRefresh(){
			this.init();
			this.gettask(function(){
				uni.stopPullDownRefresh();
				uni.$showMsg('刷新成功！')
			})
		}
	}
</script>

<style lang="scss">
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
	.task-content{
		margin-top: 108rpx;
	}

</style>
