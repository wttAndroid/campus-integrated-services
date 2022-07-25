<template>
	<view style="height: 100%;overflow: hidden;">
		<view class="user-wrap">
			<view class="user-title">
				<view v-if="token.uid!=user.uid" class="iconfont icon-icon_yinpin" @tap="callClick(user.phone)"></view>
				<view><image :src="filepicker"></image>
				<view>{{user.username}}</view></view>
				<view v-if="token.uid!=user.uid" class="iconfont icon-icon_xiaoxi_3" @click="toNavigate"></view>
			</view>
			
			<view class="user-list">
				<view v-if="user.name">
					<text>姓名</text>{{user.name}}
				</view>
				<view  v-if="user.classid">
					<text>班级</text>{{user.classid}}
				</view>
				<view  v-if="user.native">
					<text>籍贯</text>{{native}}
				</view>
				<view  v-if="user.email">
					<text>邮箱</text>{{user.email}}
				</view>
				<view  v-if="user.birthday">
					<text>生日</text>{{user.birthday}}
				</view>
				<!-- <button class="botton" type="primary" >发消息</button> -->
			</view>
		</view>
		
		<view class="user-bg">
			<view class="bottom-wrap">
				<view class="iconfont icon-a-icon_taiyangqichuang"></view>
				<view class="iconfont icon-a-icon_lanqiudribble"></view>
				<view class="iconfont icon-a-icon_youjianyouxiang"></view>
				<view class="iconfont icon-a-icon_huati"></view>
				<view class="iconfont icon-icon_diqiu"></view>
			</view>
		</view>
		
	 

	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				id:null,
				user:{
					stuid:'',
					classid:'',
					name:'',
					sex:'男',
					photo:'',
					native:["北京市","市辖区","东城区"],
					address:'',
					email:'',
					birthday:'2000-1-2'
				} 
			}
		},
		computed: {
			...mapState('m_user',['token']),
			native(){
				return  this.user.native?this.user.native.toString():''
			},
			filepicker(){
				return uni.$http.baseUrl+this.user.user_pic
			}
		},
		onLoad(options) {
			this.id=options.id;
			this.getUserinfo()
		},
		methods:{
			callClick(phone){
				uni.makePhoneCall({
					phoneNumber:phone,
					fail(e) {
						console.log(e)
					}
				})
			},
			toNavigate(){
				uni.navigateTo({
					url:"/chatpkg/chatpkg_page/chatpkg_page?id="+this.id
				})
			},
			async getUserinfo(){
				let {data}=await uni.$http.get('/api/mates/userinfo/get?uid='+this.id)
				if(data.code!=200)return uni.$showMsg();
				if(data.data&&data.data.length){
					this.user=data.data[0];
					this.user['birthday']=new Date(this.user['birthday']).Format()
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
		background-color: $uni-theme-bg-basec;
	}
	.user-wrap{
		color: $uni-text-color;
		overflow: scroll;
		position: relative;
		margin: 50rpx;
		background-color: #fff;
		// box-shadow: rgba(240, 46, 170, 0.4) -5px 5px, rgba(240, 46, 170, 0.3) -10px 10px, rgba(240, 46, 170, 0.2) -15px 15px, rgba(240, 46, 170, 0.1) -20px 20px, rgba(240, 46, 170, 0.05) -25px 25px;
		// box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
		box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
		height: 80%;
		z-index: 1;
		border-radius: 20rpx;
		.user-title{
			text-align: center;
			margin: 50rpx 0;
			font-size: 35rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			image{
				width: 200rpx;
				height: 200rpx;
				box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, #00BCD4 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
				border-radius: 50%;
				margin-bottom: 20rpx;
			}
			
			.iconfont{
				// font-size: 50rpx;
				// margin: 0rpx 80rpx;
				
				    font-size: 50rpx;
				    margin: 0rpx 80rpx;
				    background: #41485d;
				    border-radius: 20rpx;
				    padding: 8rpx;
				    color: aliceblue;
			}
		}
		.user-list{
			margin: 100rpx 50rpx 0;
			line-height: 80rpx;
			text{
				margin-right: 30rpx;
				color: $uni-text-color-grey;
			}
			.botton{
				margin-top: 50rpx;
			}
		}
	}
	.user-bg{
		position: absolute;
		background-color: $uni-theme-bg-color;
		bottom: 0;
		left: 0;
		right: 0;
		height: 25%;
		.bottom-wrap{
			    position: absolute;
			    bottom: 10rpx;
			    display: flex;
			    flex-wrap: wrap;
			    left: 0;
			    right: 0;
			.iconfont{
				color: #FFFFFF;
				font-size: 50rpx;
				margin: 0rpx 50rpx 50rpx;
				background: #41485d;
				    border-radius: 20rpx;
				    margin: 10rpx;
				    padding: 10rpx;
			}
		}
	}
</style>
