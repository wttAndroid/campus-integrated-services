<template>
	<view style="overflow: hidden;">
		<view class="my-top-wrap">
			<view class="my-user-bg">
				<view class="my-user-moneywrap" @click="gotoSubpage('/subpkg/subpkg_help/help_me')" >
					<view>
						<view>
							<uni-icons style="margin-right: 10rpx;" type="starhalf" color="#ffff"></uni-icons>
							<text>我的订单</text>
						</view>
						<text>点击查看我的订单</text>
					</view>
					 <button type="default" size="mini">立即进入</button>
					 <!-- <button type="default" size="mini" @click="gotoSubpage('/subpkg/subpkg_help/help_me')" >立即进入</button> -->
				</view>
			</view>
			<view class="my-userinfo-wrap">
				<view class="userinfo-left">
					<image class="userimg" :src="thumbnail(user.user_pic)" mode=""></image>
					<view class="userinfo-text">
						<text class="username">{{user.username}}</text>
						<text class="usertag">LV1</text>
					</view>
				</view>
				<view class="userinfo-right" @click="gotoUserPage">
					<text>主页</text>
				</view>
			</view>
		</view>
		
		<view class="my-mok" @click="gotoSubpage('/userpkg/subpkg_user/user_access/user_access')">
			<view class="mok-title">
				<text>最近记录</text>
				<text class="hover">{{latelyDate}}</text>
			</view>
			<view class="mok-content tiwen-content">
				<view class="tiwen-item">
					<view>
						<view class="iconfont icon-a-icon_menchumen" style="color: #1296db;"></view>
						<text>进校</text>
					</view>
					<text class="tiwen-date">{{historylist.enter_date}}</text>
				</view>
				<view class="tiwen-item">
					<view>
						<view class="iconfont icon-a-icon_tuichudengchu" style="color: #ea9518;"></view>
						<text>出校</text>
					</view>
					<text class="tiwen-date">{{historylist.out_date}}</text>
				</view>
				<view class="tiwen-item">
					<view>
						<view class="iconfont icon-icon_xiangpica" style="color: #9711eb;"></view>
						<text>体温</text>
					</view>
					<text class="tiwen-date" style="color: #4CD964;">{{tempdata.temp}}</text>
				</view>
			</view>
		</view>
		
		<view class="my-mok">
			<view class="mok-title">
				<text>周日课表</text>
				<text class="hover"></text>
			</view>
			<view class="mok-content kebiao-content" @click="gotoSubpage('/subpkg/subpkg_class/subpkg_class')">
				<view >
					<view>
						<text>快来查看你的专属课表吧</text>
					</view>
					<text>立即尝试</text>
				</view>
			</view>
		</view>
		
		
		<view class="my-mok">
			<view class="mok-title">
				<text>更多服务</text>
			</view>
			<view class="mok-content gengduo-content">
				<view class="gengduo-item">
					<view  @click="gotoSubpage('/userpkg/subpkg_user/user_edit/user_edit')">
						<view class="iconfont icon-icon_maisui_zuo"></view>
						<text>校园号管理</text>
					</view>
					<uni-icons type="forward"></uni-icons>
				</view>
				<view class="gengduo-item">
					<view @click="gotoSubpage('/userpkg/subpkg_user/user_basic/user_basic')">
						<view class="iconfont icon-icon_shezhi_3"></view>
						<text>账号设置</text>
					</view>
					<uni-icons type="forward"></uni-icons>
				</view>
				<view class="gengduo-item" @click="helpClick">
					<view>
						<view class="iconfont icon-a-icon_youjianyouxiang"></view>
						<text>帮助反馈</text>
					</view>
					<uni-icons type="forward"></uni-icons>
				</view>
				<view class="gengduo-item" @click="backClick">
					<view>
						<view class="iconfont icon-a-icon_tuichudengchu"></view>
						<text>退出登录</text>
					</view>
					<uni-icons type="forward"></uni-icons>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popup">
			<view style="background-color: #fff;text-align: center;">
				<image src="https://wttandroid.gitee.io/wttandroid.github.io/src/img/qq.jpg" mode="widthFix"></image>
			</view>
		</uni-popup>
					
	</view>
</template>

<script>
	import  '@/utils/utils.js'
	import {mapState,mapActions} from 'vuex';
	export default {
		data() {
			return {
				historylist:{},
				tempdata:{
					temp:'未上报'
				}
			};
		},
		computed:{
			...mapState('m_user',['token','user']),
			latelyDate(){
				return new Date().Format()
			},
			thumbnail(){
				return function(user_pic=''){
					return uni.$http.baseUrl+user_pic;
				}
			}
		},
		methods:{
			...mapActions('m_user',['exit']),
			helpClick(){
				//这是我的QQ账号：您可以
				this.$refs.popup.open()
			},
			backClick(){
				uni.showModal({
					title:'提示',
					content:'是否确认退出？',
					showCancel:true,
					success:(res)=>{
						if(res.confirm){
							this.redirectTo("/subpkg/subpkg_login/subpkg_login");
							this.exit()
						}
				}
				})
			},
			gotoUserPage(){
				uni.navigateTo({
					url:"/chatpkg/chatpkg_user/chatpkg_user?id="+this.token.uid
				})
			},
			redirectTo(url){
				console.log(url)
				uni.redirectTo({
					url:url,
					fail(e) {
						console.log(e)
					}
				})
			},
			gotoSubpage(url){
				console.log(url)
				uni.navigateTo({
					url:url,
					fail(e) {
						console.log(e)
					}
				})
			},
			async getAccess(){
				//获取当前用户最近记录以及体温信息
				let {data}=await uni.$http.post('/api/access/history/lately',{uid:this.token.uid});
				if(data.code!=200)return uni.$showMsg(data.message);
				let historylist=data.data.map(item=>{
					item['enter_date']=(item.enter_date&&new Date(item.enter_date).Format())||'';
					item['out_date']=(item.out_date&&new Date(item.out_date).Format())||''
					return item
				})
				this.historylist=historylist[0]
				
			},
			async gettimep(){
				//this.token.uid
				let {data}=await uni.$http.post('/api/access/temp/get',{uid:this.token.uid})
				if(data.code==200&&data.data&&data.data.length){
					this.tempdata=data.data[0];
				}
			}
		},
		onShow() {
			this.getAccess();
			this.gettimep();
		}
	}
</script>

<style lang="scss">
	page{
		background-color: $uni-theme-bg-basec;
	}
	.my-top-wrap{
		    position: relative;
		    height: 350rpx;
			color: #fff;
	}
	.my-user-bg{
		position: absolute;
		top: 0;
		left: -25%;
		width: 150%;
		height: 350rpx;
		border-bottom-left-radius: 100%;
		border-bottom-right-radius: 100%;
		background-image:linear-gradient(0deg,#4fd2cc,#4fd2cc 50%);
		z-index: 1;
		overflow: hidden;
	}
	.my-userinfo-wrap{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		padding: $uni-them-margin-other;
		z-index: 2;
		position: inherit;
		.userinfo-left{
			.userimg{ 
			    width: 100rpx;
			    border-radius: 50%;
			    height: 100rpx;
			    vertical-align: bottom;
				margin-right: 10rpx;
				border: 2rpx solid #fff;
		}
		.userinfo-text{
			display: inline-block;
			.username{
				display: block;
			}
			.usertag{
				border-radius: 50%;
				background-color: red;
				color: #fff;
				font-size: $uni-font-size-sm;
				padding: 0rpx 10rpx;
			}
		}
		}
		.userinfo-right{
			width: 100rpx;
			text-align: center;
			background-color: #000000;
			border-radius: 20rpx;
			font-size: $uni-font-size-sm;
		}
		
	}
	
	.my-user-moneywrap{
		    display: flex;
		    -webkit-box-pack: justify;
		    -webkit-justify-content: space-between;
		    justify-content: space-between;
		    -webkit-box-align: center;
		    -webkit-align-items: center;
		    align-items: center;
		    font-size: 24rpx;
		    position: absolute;
		    bottom: 0rpx;
		    background-color: #413e5f;
		    left: 20%;
		    right: 20%;
		    align-items: center;
		    overflow: hidden;
		    border-top-left-radius: 35rpx;
		    border-top-right-radius: 35rpx;
		    padding: 20rpx 20rpx 50rpx;
			
			button{
				font-size: $uni-font-size-sm;
				border-radius: 50rpx;
				    height: 50rpx;
				    margin: 0rpx;
				    line-height: 50rpx;
			}
	}
	.my-mok{
		margin: $uni-them-margin;
		background-color: #fff;
		padding: $uni-them-margin;
		border-radius: 20rpx;
		box-shadow: 0 1px 1px #f2f2f2;
		margin-bottom: 20rpx;
		
		.mok-title{
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;
			height: 100rpx;
			line-height: 100rpx;
			position: relative;
			&::before{
				position: absolute;
				content: '';
				left: $uni-them-margin-other*-1;
				height: 50%;
				width: 8rpx;
				background-color: $uni-theme-bg-color;
				border-radius: 10rpx;
			}
			.hover{
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}
		}
		.mok-content{
			
		}
		.kebiao-content{
			height: 150rpx;
			color: $uni-text-color-grey;
		}
		.gengduo-content{
			.gengduo-item{
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
				height:80rpx;
				line-height: 80rpx;
				text{
					margin-left: 10rpx;
				}
			}
		}
		.tiwen-content{
			display: flex;
			justify-content: space-between;
			.tiwen-item{
				height: 150rpx;
				line-height: 50rpx;
				flex: 0 0 33%;
				font-size: $uni-font-size-base;
				color: #6f6f6f;
				image{
					width: 40rpx;
					vertical-align: middle;
					margin-right: 10rpx;
				}
				.tiwen-date{
					color: #333;
					font-weight: bold;
				}
				&:nth-child(1){
					text-align: left;
				}
				&:nth-child(2){
					text-align: center;
				}
				&:nth-child(3){
					text-align: right;
				}
			}
		}
	}
</style>
