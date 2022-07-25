<template>
	<view>
		<view class="edit-item">
			<view>
				<uni-file-picker :value="filepicker" limit="1" @select="selectPicker" :del-icon="false" disable-preview :imageStyles="imageStyles"
				file-mediatype="image">选择</uni-file-picker>
			</view>
			<view>
				<view class="iconfont icon-arrow-right"></view>
			</view>
		</view>
		
		<view class="edit-item">
			<view>
				<text class="label">昵称</text>
				<input  maxlength="12"  :disabled="isedit.username" class="input" type="text" v-model="params.username">
			</view>
			<view>
				<text v-if="isedit.username" @click="isedit.username=!isedit.username" class="hover">修改</text>
				<text v-else class="hover" @click="editClick('username')">保存</text>
				<view class="iconfont icon-arrow-right"></view>
			</view>
		</view>
		<home-margin-bar></home-margin-bar>
		
		<view class="edit-item">
			<view class="left">
				<text class="label">手机号</text>
				<input :disabled="isedit.phone"  class="input" type="text"  v-model="params.phone">
			</view>
			<view class="right">
				<text v-if="isedit.phone" @click="isedit.phone=!isedit.phone" class="hover">修改绑定</text>
				<text v-else class="hover" @click="editClick('phone')">保存</text>
				<view class="iconfont icon-arrow-right"></view>
			</view>
		</view>
		<view class="edit-item">
			<view>
				<text class="label">森林号</text>
				<text class="content">{{params.uid}}</text>
			</view>
			<view>
				<view class="iconfont icon-arrow-right"></view>
			</view>
		</view>
		<view class="edit-item" @click="navigateTo('/userpkg/subpkg_user/user_edit/user_edit')">
			<view>
				<text class="label">更多信息</text>
			</view>
			<view>
				<view class="iconfont icon-arrow-right"></view>
			</view>
		</view>
		<home-margin-bar></home-margin-bar>
	</view>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	export default {
		data() {
			return {
				imageStyles: {
									width: 64,
									height: 64,
									border: {
										radius: '50%'
									}
				},
				params:{
					username:'',
					uid:'',
					phone:'',
					user_pic:''
				},
				Mates:{
					
				},
				isedit:{
					phone:true,
					username:true,
					user_pic:true
				}
			};
		},
		computed:{
			...mapState('m_user',['token']),
			filepicker(){
				return {url:uni.$http.baseUrl+this.params.user_pic}
			}
		},
		onLoad() {
			this.loadUser()
		},
		methods:{
			...mapActions('m_user',['saveUser']),
			navigateTo(url){
				uni.navigateTo({
					url:url
				})
			},
			async editClick(key){
				let params={uid:this.token.uid};
				params[key]=this.params[key];
				let {data}=await uni.$http.post('/api/mates/userinfo/editbasic',params)
				if(data.code!=200)return uni.$showMsg(data.message);
				uni.$showMsg(data.message);
				this.isedit[key]=true //修改状态
				this.updateState();
			},
			async updateState(){
				let {data}=await uni.$http.get('/api/mates/userinfo/update?uid='+this.token.uid)
				if(data.code!=200)return uni.$showMsg(data.message);
				this.saveUser(data.data)
				uni.navigateBack()
			},
			selectPicker(e){
				console.log(e)
				this.updatePicker(e.tempFilePaths)
			},
			updatePicker(tempFilePaths){
				let that=this;
				uni.showLoading({
					title:'上传中'
				})
				uni.uploadFile({
					url:uni.$http.baseUrl+'/api/file/upload',
					filePath:tempFilePaths[0],
					name:'file',
					header:{
						Authorization:that.token.tokenn,
						"Content-Type":"multipart/form-date"
					},
					success:(res)=>{
						let datas=JSON.parse(res.data)
						uni.hideLoading();
						if(datas.code==200){
							uni.$showMsg('上传成功',200);
							that.params['user_pic']=datas.data.filepath
							that.editClick('user_pic')
						}else{
							uni.$showMsg('上传失败')
						}
					}
				})
			},
			async loadUser(){
				let {data}=await uni.$http.get('/api/mates/userbasic/get?uid='+this.token.uid);
				if(data.code!=200)return uni.$showMsg(data.message);
				this.params=data.data
			}
			// async loadMates(){
			// 	let {data}=await uni.$http.get('/api/mates/userinfo/get?uid='+this.token.uid);
			// 	if(data.code!=200)return uni.$showMsg(data.message);
			// 	this.Mates=data.data
			// }
		}
	}
</script>

<style lang="scss">
	page{
		background-color: $uni-theme-bg-basec;
	}
.iconfont{
	    font-size: 35rpx;
		vertical-align: middle;
}
.edit-item{
	background-color: $uni-bg-color;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	    align-items: center;
	    height: 110rpx;
	    line-height: 110rpx;
	    padding: 10rpx 30rpx;
	    border-bottom: 1rpx solid $uni-border-color-base;
	&>view{
		height: inherit;
		line-height: inherit;
	}
	.label{
		vertical-align: middle;
	}
	
	.content,{
		vertical-align: middle;
		text-align: left;
		margin: 0 20rpx;
		height: initial;
		line-height: initial;
		display: inline-block;
		color: $uni-text-color-grey;
	}
	.input{
		vertical-align: middle;
		text-align: left;
		margin: 0 20rpx;
		height: initial;
		line-height: initial;
		display: inline-block;
		color: $uni-text-color;
		&[disabled]{
			color: $uni-text-color-grey;
		}
	}
	.hover{
		color: #6495ed;
	}
}
.file-picker__box {
	margin: 0 !important;
}
</style>
