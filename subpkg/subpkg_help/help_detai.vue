<template>
	<view>
		<view>
			<view class="detail-top-wrap">
				<image src="http://123.56.144.92:8883/bg5.png" mode="widthFix"></image>
				<view class="top-info">
					<text style="font-weight: bold;">{{statefrom(orderdetail.state)}}</text>
					<view style="font-size: 24rpx;" v-if="!orderdetail.state">
						<uni-countdown :day="countdown.day" :hour="countdown.hour" :minute="countdown.minute" />
					</view>
				</view>
			</view>
			<view class="detail-mok">
				<view class="mok-title">交易人信息</view>
				<view>
					<text class="left">发布者</text>
					<view class="user-info" @click="gotoUserPage(orderdetail.uid)">
						<image :src="orderdetail.user_pic" mode="widthFix"></image>
						<text style="margin-left: 10rpx;">{{orderdetail.username}}</text>
					</view>
				</view>
				<view v-if="orderdetail.serverid">
					<text class="left">服务者</text>
					<view class="user-info" @click="gotoUserPage(orderdetail.serverid)">
						<image :src="orderdetail.server_pic" mode="widthFix"></image>
						<text style="margin-left: 10rpx;">{{orderdetail.servername}}</text>
					</view>
				</view>
			</view>
		</view>
		<home-margin-bar></home-margin-bar>
		<view class="detail-mok">
			<view class="mok-title">任务信息</view>
				<view class="detail-item">
					<text class="left">任务赏金</text>
					<text class="right">{{orderdetail.money}}元</text>
				</view>
			<view class="detail-item">
				<text class="left">任务</text>
				<text class="right">{{orderdetail.title}}</text>
			</view>
			<view class="detail-item">
				<text class="left">任务备注</text>
				<text class="right">{{orderdetail.task_remark}}</text>
			</view>
			<view class="detail-item">
				<text class="left">任务地址</text>
				<view class="right"@click="goMap">
					<view class="iconfont icon-icon_dingwei"></view>
					<text>{{orderdetail.task_address['name']}}</text>
				</view>
			</view>
			<view class="detail-item">
				<text class="left">联系人</text>
				<text class="right">{{orderdetail.task_contact}}</text>
			</view>
			<view class="detail-item" style="height: auto;">
				<text class="left">图片</text>
				<image v-if="orderdetail.task_pic" class="right" style="max-width: 250rpx;" :src="thumbnail(orderdetail.task_pic)" mode="widthFix"></image>
			</view>
		</view>
		<home-margin-bar></home-margin-bar>
		<view class="detail-mok">
			<view class="mok-title">订单信息</view>
			<view class="detail-item">
				<text class="left">任务号</text>
				<text class="right">{{orderdetail.taskid}}</text>
			</view>
			<view class="detail-item">
				<text class="left">订单号</text>
				<text class="right">{{orderdetail.orderid}}</text>
			</view>
			<view class="detail-item">
				<text class="left">任务发布时间</text>
				<text class="right">{{orderdetail.start_time}}</text>
			</view>
			<view class="detail-item">
				<text class="left">任务截至时间</text>
				<text class="right">{{orderdetail.end_time}}</text>
			</view>
		</view>
		<home-margin-bar></home-margin-bar>
		<view class="detail-mok">
			<view class="mok-title">其他设置</view>
			<view class="detail-item">
				<text class="left">评价星星</text>
				<view class="right">
					<uni-rate :readonly="true" :value="parseInt(orderdetail.comment_star)" />
				</view>
			</view>
			<view class="right left">
				{{orderdetail.comment_txt||''}}
			</view>
		</view>
		<home-margin-bar></home-margin-bar>
			<button v-if="isbutton(1)"  type="primary" style="margin: 20rpx" @click="submitOrder">接单</button>
			<button v-if="isbutton(2)"  type="warn" style="margin: 20rpx" @click="cancelOrder">取消接单</button>
			<button v-if="isbutton(3)"  type="warn" style="margin: 20rpx" @click="deleOrder">关闭此单</button>
			
			<button v-if="isbutton(4)"  type="primary" style="margin: 20rpx" @click="achieveOrder">支付</button>
			<button v-if="isbutton(5)"  type="primary" style="margin: 20rpx" @click="$refs.inputDialog.open()">评价</button>
	
			
			<uni-popup ref="inputDialog" type="dialog">
				<view class="star-wrap">
					<view class="star-top">
						<text>点击星星来评分</text>
						<view class="star-item"><uni-rate v-model="comment_star" @change="staronChange" /></view>
						<uni-easyinput type="textarea" v-model="comment_txt" placeholder="请写下您对这次帮助的评价..." />
						
					</view>
					<view class="star-button_wrap">
						<view @click="$refs.inputDialog.close()">取消</view>
						<view @click="commentOrder">确定</view>
					</view>
				</view>
			</uni-popup>
	
	</view> 
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				orderdetail:{},
				comment_txt:'',
				comment_star:5,
				countdown:{
					day:0,
					hour:0,
					minute:0
				}
			};
		},
		onLoad(options){
			let {id}=options;
			this.getorderinfo(id)
		},
		computed:{
			...mapState('m_user',['token']),
			thumbnail(){
				return function(user_pic){
					return uni.$http.baseUrl+user_pic;
				}
			},
			statefrom(){
				return function (state){
					//0等待接单 //1等待支付
					if(state==-1) return '已关闭'
					if(state==0) return '待接单'
					if(state==1) return '待支付'
					if(state==2) return '已支付' 
					if(state==3) return '已完成' 
				}
			},
			isbutton(){
				let state=this.orderdetail.state; //订单状态
				let oneself=this.token.uid; //当前用户
				let uid=this.orderdetail.uid; //发布者
				let serverid=this.orderdetail.serverid; //服务者
				
				return function(tag){
					switch(tag){
						case 1: //显示接单：状态0、我不是发布者
							return state==0&&oneself!=uid
						case 2: //取消接单：状态1、我是服务者、存在发布者
							return state==1&&oneself==serverid&&uid
						case 3: //取消此单：状态0、我是发布者
							return state==0&&oneself==uid
						case 4: //结此单：状态1、我是发布者、存在服务者
							return state==1&&oneself==uid&&serverid
						case 5: //评价：状态2、我是发布者、存在服务者
							return state==2&&oneself==uid&&serverid
						default:
							return false
					}
					
					
				}
			}
		},
		methods:{
			gotoUserPage(id){
					uni.navigateTo({
						url:"/chatpkg/chatpkg_user/chatpkg_user?id="+id
					})
			},
			goMap(){
				let that=this;
				const lat = this.orderdetail&&this.orderdetail.task_address&&this.orderdetail.task_address['latitude']&&parseFloat(this.orderdetail.task_address['latitude'])
				const log = this.orderdetail&&this.orderdetail.task_address&&this.orderdetail.task_address['longitude']&&parseFloat(this.orderdetail.task_address['longitude'])
				
				if(!(lat&&log))return uni.$showMsg('该发布者没有使用定位！')
					
				uni.authorize({
				    scope: 'scope.userLocation',
				    success(res) {
				      uni.openLocation({
						latitude:lat,
						longitude:log,
						success: function() {}
					  })
				    },
					fail(err) {uni.$showMsg(err)}
				})
			},
			initcountdown(){ //初始化倒计时
				if(this.orderdetail.state==0&&this.orderdetail.end_time){
					let date1 = new Date(this.orderdetail.end_time);
					this.countdown=date1.countdownObj()
				}
			},
			async getorderinfo(id){
				let {data}=await uni.$http.get('/api/task/order/get?id='+id)
				if(data.code!=200) return uni.$showMsg(data.message);
				data.data['user_pic']=uni.$http.baseUrl+data.data['user_pic']
				data.data['server_pic']=uni.$http.baseUrl+data.data['server_pic']
				data.data['task_address']=JSON.parse(data.data['task_address']);
				this.orderdetail=data.data;
				this.initcountdown()
			},
			async submitOrder(){
				let orderid=this.orderdetail&&this.orderdetail.orderid
				let serverid=this.token&&this.token.uid
				
				if(!(orderid&&serverid))return uni.$showMsg('缺少必要信息，接单失败！');
				
				let {data}=await uni.$http.post('/api/task/order/add',{orderid,serverid});
				if(data.code!=200) return uni.$showMsg(data.message);
				uni.$showMsg('接单成功！');
				uni.redirectTo({url:"/subpkg/subpkg_help/help_me"})
			},
			async cancelOrder(){
				let orderid=this.orderdetail&&this.orderdetail.orderid
				let uid=this.token&&this.token.uid
				
				if(!(orderid&&uid))return uni.$showMsg('缺少必要信息，取消接单失败！');
				
				let {data}=await uni.$http.post('/api/task/order/cancel',{orderid,uid});
				if(data.code!=200) return uni.$showMsg(data.message);
				uni.$showMsg('取消接单成功！');
				uni.redirectTo({url:"/subpkg/subpkg_help/help_me"})
			},
			async deleOrder(){
				let orderid=this.orderdetail&&this.orderdetail.orderid
				let uid=this.token&&this.token.uid
				
				if(!(orderid&&uid))return uni.$showMsg('缺少必要信息，关闭此单失败！');
				
				let {data}=await uni.$http.post('/api/task/order/close',{orderid,uid});
				if(data.code!=200) return uni.$showMsg(data.message);
				uni.$showMsg('关闭此单成功！');
				uni.redirectTo({url:"/subpkg/subpkg_help/help_me"})
				
			},
			async achieveOrder(){
				let orderid=this.orderdetail&&this.orderdetail.orderid
				let uid=this.token&&this.token.uid
				
				if(!(orderid&&uid))return uni.$showMsg('缺少必要信息，支付失败！');
				
				let {data}=await uni.$http.post('/api/task/order/achieve',{orderid,uid});
				if(data.code!=200) return uni.$showMsg(data.message);
				uni.$showMsg('支付成功！');
				uni.redirectTo({url:"/subpkg/subpkg_help/help_me"})
			},
			async commentOrder(){
				let orderid=this.orderdetail&&this.orderdetail.orderid
				let uid=this.token&&this.token.uid
				if(!(orderid&&uid))return uni.$showMsg('缺少必要信息，评价失败！');
				
				let comment_txt=this.comment_txt;
				let comment_star=this.comment_star;
				
				let {data}=await uni.$http.post('/api/task/order/comment/add',{orderid,uid,comment_txt,comment_star});
				if(data.code!=200) return uni.$showMsg(data.message);
				uni.$showMsg('评价成功！');
				uni.redirectTo({url:"subpkg/subpkg_help/help_me"})
			},
			staronChange(e){
				this.comment_star=e.value
			}
		}
	}
</script>

<style lang="scss">
	.user-info{
		padding: 20rpx;
		display: flex;
		align-items: center;
		image{
			width: 100rpx;
			vertical-align: middle;
			border-radius: $uni-border-radius-base;
			border: 1px solid #00BCD4;
		}
		text{
			
		}
	}
	
	.star-wrap{
		    background: #fff;
		    text-align: center;
		    border-radius: 10rpx;
			.star-item{
				margin: 50rpx 0;
				.uni-rate{
					    justify-content: center;
				}
			}
			.star-top{
				padding: 20rpx;
				width: 500rpx;
			}
			.star-button_wrap{
				display: flex;
				height: 100rpx;
				line-height: 100rpx;
				align-items: center;
				border-top: 1rpx solid #eaeaea;
				view{
					flex: 1;
					text-align: center;
				}
			}
	}
	
	
	.detail-top-wrap{
		margin: 20rpx;
		position: relative;
		min-height: 200rpx;
		border-radius: 15rpx;
		background: linear-gradient(to right, #03A9F4, #07d2d1);
		border: 1px solid #07d2d1;
		color: #fff;
		&>image{
			position: absolute;
			right: 0;
			width: 300rpx;
		}
		.top-info{
			margin: 50rpx;
			text{
				display: block;
			}
		}
	}
	
	.detail-mok{
		padding: 30rpx;
		.mok-title{
			font-weight: bold;
		}
		.detail-item{
			    overflow: hidden;
			display: flex;
			justify-content: space-between;
			color: $uni-text-color;
			    height: 100rpx;
			    line-height: 100rpx;
		}
		.left{
			color: $uni-text-color-grey;
		}
		.right{
			text-align: right;
		}
	}
	
</style>
