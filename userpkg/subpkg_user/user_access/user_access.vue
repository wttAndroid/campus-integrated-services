<template>
	<view class="access-wrap" style="overflow: hidden;">
		<view class="access-top">
			<image src="http://123.56.144.92:8883/bg4.png" mode="widthFix"></image>
		</view>
		<view class="access-cont">
			<view class="cont-item" @click="gotoSubpage('/userpkg/subpkg_user/user_access/access_qrcode',1)">
				<view class="iconfont icon-a-icon_menchumen" style="color: #36ab60;" ></view>
				出入二维码
			</view>
			<view class="cont-item"  @click="gotoSubpage('/userpkg/subpkg_user/user_access/access_history')">
				<view class="iconfont icon-icon_wendang_1" style="color: #d81e06;"></view>
				出入记录
			</view>
			<view class="cont-item" @click="gotoSubpage('/userpkg/subpkg_user/user_access/access_add')">
				<view class="iconfont icon-icon_tianjia" style="color: #1296db;"></view>
				出入申请
			</view>
			<view class="cont-item" @click="gotoSubpage('/userpkg/subpkg_user/user_access/access_temp')">
				<view class="iconfont icon-icon_xiangpica" style="color: #efb336;" ></view>
				体温上报
			</view>
			<view class="cont-item">
				<view class="iconfont icon-icon_saoyisao" style="color: #36ab60;" ></view>
				扫一扫
			</view>
		</view>
		<!-- <view class="home-top-bg"></view>
		<view class="access-top">
			<view class="top-class">山西传媒学院(大学城)</view>
			<text class="top-address">
				<view class="iconfont icon-tianjia"></view>
				山西省晋中市大学区</text>
			<view class="top-hover">
				欢迎您！
			</view>
		</view>
		<view class="access-cont">
			<view class="cont-item" @click="gotoSubpage('/userpkg/subpkg_user/user_access/access_qrcode',1)">
				<view class="iconfont icon-a-icon_menchumen" style="color: #36ab60;" ></view>
				出入二维码
			</view>
			<view class="cont-item"  @click="gotoSubpage('/userpkg/subpkg_user/user_access/access_history')">
				<view class="iconfont icon-icon_wendang_1" style="color: #d81e06;"></view>
				出入记录
			</view>
			
			<view class="cont-item" @click="gotoSubpage('/userpkg/subpkg_user/user_access/access_add')">
				<view class="iconfont icon-icon_tianjia" style="color: #1296db;"></view>
				出入申请
			</view>
			<view class="cont-item" @click="gotoSubpage('/userpkg/subpkg_user/user_access/access_temp')">
				<view class="iconfont icon-icon_xiangpica" style="color: #efb336;" ></view>
				体温上报
			</view>
			<view class="cont-item">
				<view class="iconfont icon-icon_saoyisao" style="color: #36ab60;" ></view>
				扫一扫
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			gotoSubpage(url,tag){
				uni.navigateTo({
					url:url+"?tag="+tag,
					fail(e) {
						console.log(e)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: $uni-theme-bg-basec;
	}
	// .home-top-bg{
	// 	position: absolute;
	// 	top: -50px;
	// 	left: -25%;
	// 	width: 150%;
	// 	height: 350rpx;
	// 	border-bottom-left-radius: 100%;
	// 	border-bottom-right-radius: 100%;
	// 	z-index: -1;
	// 	background-image: linear-gradient(125deg,#4cd7e0,#4cd7e0 65%);
	// }
// 	.access-wrap{
		
// 	}
// .access-top{
// 	       position: relative;
// 	       background-color: #FFFFFF;
// 	       margin: 80rpx 30rpx;
// 	       font-weight: bold;
// 	    color: #333;
// 	    padding: 40rpx;
// 	        border-radius: 10rpx;
// 	        box-shadow: 1rpx 5rpx 10rpx 0rpx #ded9d9;
// 	.top-class{
// 		font-size: 40rpx;
// 	}
// 	.top-address{
// 		color: $uni-text-color-grey;
// 		font-size: $uni-font-size-sm;
// 	}
// 	.top-hover{
// 		font-size: $uni-font-size-title;
// 		margin-top: 30rpx;
// 	}
// }
.access-top{
	margin: 40rpx;
	image{
		width: 100%;
		border-radius: 20rpx;
	}
}
.access-cont{
	display: flex;
	justify-content: left;
	padding: 20rpx;
	margin: 20rpx;
	flex-wrap: wrap;
	background-color: #FFFF;
	border-radius: 20rpx;
	box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
	.cont-item{
		flex: 0 0 50%;
		text-align: center;
		margin: 60rpx 0;
		.iconfont{
			display: block;
			font-size: 80rpx;
			margin-bottom:20rpx;
		}
	}
}
</style>
