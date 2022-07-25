<template>
	<view class="login-wrap">
		<image class="background-wrap"  src="http://123.56.144.92:8883/bg2.png" mode="widthFix"></image>
		
		<view class="form-wrap">
			<view class="form-item">
				<label>
					<view class="iconfont icon-shouji"></view>
				</label>
				<input  v-model="reginUser.phone" type="number" maxlength="11"  placeholder="请输入手机号码" />
			</view>
			
			<view class="form-item">
				<label>
					<view class="iconfont icon-renzheng"></view>
				</label>
				<input v-model="reginUser.authcode" maxlength="10"  type="text" placeholder="请输入验证码" />
				<view class="form-code">
					<button :disabled="isdisabled" @click="getCode" type="default" size="mini">{{count||'获取验证码'}}</button>
				</view>
			</view>
			
			<view class="form-item">
				<label>
					<view class="iconfont icon-icon_shangsuo"></view>
				</label>
				<input v-model="reginUser.password" maxlength="6"   password type="safe-password" placeholder="请输入密码" />
				
			</view>
			<view class="bottom-wrap">
				<view>
					<checkbox  style="transform:scale(0.7)" :checked="isAgree" @click="isAgree=!isAgree" />
					<text>我阅读并同意<text class="copy">【哈哈哈】</text>协议</text>
				</view>
			</view>
			<button class="submit-button" type="default" @click="reginsterClick">注册</button>
			
			
			<view class="login-other-wrap">
				<navigator url="./subpkg_login">已有账户?点击登录</navigator>
			</view>
			
			
			
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageUrl:'/static/image/login.jpeg',
				count:null, //当前秒数
				authCode:'0000',
				isdisabled:false,
				isAgree:false,
				interval:null,
				reginUser:{
					phone:'',
					password:'',
					authcode:''
				}
			};
		},
		methods:{
			 getCode(){
				this.isdisabled=true;
				if(this.interval)clearInterval(this.interval);
				this.startInterval();
			},
			startInterval(){
				let i=60;
				let that=this;
				this.createCode();//发送当前验证码
				this.interval=setInterval(()=>{
					i--;
					that.count=i;//更改当前秒数
					if(that.count==0){
						that.count=null;
						clearInterval(that.interval);
						that.interval=null
						that.isdisabled=!that.isdisabled;
						that.authCode='0000';
					}
				},1000)
			},
			createCode(){
				this.authCode=String(Math.floor(Math.random()*10))+String(Math.floor(Math.random()*10))+String(Math.floor(Math.random()*10))+String(Math.floor(Math.random()*10))
				console.log(this.authCode)
				uni.showToast({
					title:'验证码是：'+this.authCode
				})
			},
			async reginsterClick(){
				let patt = /^[1][3-8]+\d{9}$/;
				let reginUser=this.reginUser;
				
				if(!patt.test(reginUser.phone))return uni.$showMsg('请重新核对手机号！')
				if(this.authCode!=reginUser.authcode)return uni.$showMsg('请重新核对验证码')
				if(reginUser.password.length<3)return uni.$showMsg('请输入3-6位的密码！');
				if(!this.isAgree)return uni.$showMsg('请仔细阅读协议！')
				
				let {data}=await uni.$http.post('/user/register',reginUser)
				if(data.code!=200)return uni.$showMsg(data.message);
				uni.$showMsg('注册成功');
				uni.redirectTo({
					url:'/subpkg/subpkg_login/subpkg_login',
					success() {
						uni.$showMsg("前往登录~");
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/style/login.scss";
	.form-wrap{
		margin: 55% auto 0;
			.form-code{
				button{
					width: 200rpx;
					text-align: center;
					height: 60rpx;
					line-height: 60rpx;
					color: $uni-them-font-color;
					background-color: $uni-bg-color;
					text-align: center;
					padding: 0rpx;
					margin-top: 15rpx;
					&[disabled]{
						color: $uni-text-color-grey;
					}
				}
			}
	}
	
	.bottom-wrap{
		margin-top:30rpx;
		text-align: center;
		color: $uni-text-color-grey;
		.copy{
			color: $uni-them-font-color;
		}
	}

</style>
