<template>
	<view class="login-wrap">
		<image class="background-wrap"  src="http://123.56.144.92:8883/bg3.png" mode="widthFix"></image>
		<view class="form-wrap">
			<view class="form-item">
				<label>
					<view class="iconfont icon-haoyourenzheng"></view>
				</label>
				<input v-model="loginUser.phone" maxlength="11" type="number" placeholder="请输入手机号码" />
			</view>
			<view class="form-item">
				<label>
					<view class="iconfont icon-icon_shangsuo" ></view>
				</label>
				<input v-model="loginUser.password"  maxlength="6" password type="safe-password" placeholder="请输入密码" />
			</view>
			<button class="submit-button" type="default" @click="loginClick">登录</button>
			
			<view class="login-other-wrap">
				<text>忘记密码</text>
				<text style="margin: 0rpx 20rpx;">|</text>
				<navigator class="gotologin"url="./subpkg_regin">立即注册</navigator>
			</view>
			<view class="bottom-wrap">
				<view class="bottom-title"><text>第三方登录</text></view>
				<view class="button-wrap">
					<image src="../../static/icon/weixin.png" mode="widthFix"></image>
					<image src="../../static/icon/weibo.png" mode="widthFix"></image>
					<image src="../../static/icon/QQ.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
			
	</view>
</template>

<script>
	import {mapState,mapActions } from 'vuex';
	export default {
		data() {
			return {
				imageUrl:'/static/image/login.jpeg',
				loginUser:{
					phone:'18334652445',
					password:''
				}
			};
		},
		computed:{
			...mapState('m_user',['token'])
		},
		methods:{
			...mapActions('m_user',['savetoken']),
			async loginClick(){
				let patt = /^[1][3-8]+\d{9}$/;
				let loginUser=this.loginUser;
				
				if(!patt.test(loginUser.phone))return uni.$showMsg('请重新核对手机号！')
				if(loginUser.password.length<3)return uni.$showMsg('请输入3-6位的密码！');
				
				let {data}=await uni.$http.post('/user/login',loginUser);
				if(data.code!=200) return uni.$showMsg(data.message);
				
				await this.savetoken(data.data);
				uni.switchTab({
					url:'/pages/index/index',
					success() {
						uni.$showMsg("登录成功");
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/login.scss";
	.form-wrap{
		 margin: 65% auto 0;
	}
	.bottom-wrap{
		margin-top:80rpx;
		text-align: center;
		.bottom-title{
			color: $uni-text-color-grey;
			position: relative;
			&>text{
				background-color: $uni-bg-color;
				padding: 0rpx 20rpx;
			}
			&::after{
				position: absolute;
				top: 50%;
				left: 0rpx;
				right: 0rpx;
				content: '';
				height: 1rpx;
				border-bottom: 1rpx dashed $uni-text-color-grey;
				z-index: -1;
			}
		}
		.button-wrap{
				image{
					width: 55rpx;
					margin: 50rpx;
				}
		}
	}

</style>
