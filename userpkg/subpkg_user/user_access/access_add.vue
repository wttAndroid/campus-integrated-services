<template>
	<view style="overflow: hidden;">
		<view class="add-top">
			<view class="top-title">学生出入申请</view>
			<text class="top-title-hover">所有同行人需要进行登记方可进入</text>
		</view>
		<view class="add-mok">
			<view class="mok-item border">
				<text>01.姓名</text>
				<input v-model="baseFormData.access_name" type="TEXT" maxlength="11" placeholder="请输入姓名">
				<view class="iconfont icon-arrow-right"></view>
			</view>
			<view class="mok-item border">
				<text>02.手机号码</text>
				<input v-model="baseFormData.access_phone" type="number" maxlength="11" placeholder="请输入手机号码">
				<view class="iconfont icon-arrow-right"></view>
			</view>
			<view class="mok-item border">
				<text>03.身份证号码</text>
				<input v-model="baseFormData.access_ids" type="text" maxlength="30" placeholder="请输入身份证号码">
				<view class="iconfont icon-arrow-right"></view>
			</view>
			<view style="padding: 20rpx 0;">
				<view>04.出入信息</view>
				<view class="access-item">
					<uni-data-select class="access-item-left"  v-model="baseFormData.type"  :localdata="range" placeholder="出入方式"></uni-data-select>
					<uni-datetime-picker v-if="baseFormData.type>=3" v-model="baseFormData.date" :start="new Date().FormatDate()" type="datetimerange" rangeSeparator="至" />
					<uni-datetime-picker v-else  placeholder="出入时间" class="access-item-right" :start="new Date().FormatDate()" type="datetime"  v-model="baseFormData.date"/>
				</view>
			</view>
			<view class="border">
				<view>05.出入缘由</view>
				<view>
					<textarea v-model="baseFormData.reason"   placeholder="简诉一下您要出入缘由" />
				</view>
			</view>
			<view>
				<view>06.健康码上传</view>
				<view>
					<view class="example-body">
						<uni-file-picker@select="selectPick" @delete="deletepic" return-type="object"  fileMediatype="image"  ref="files" :auto-upload="false" limit="1" title="最多选择1张图片"></uni-file-picker>
					</view>
				</view>
			</view>
		</view>
		<button type="primary" style="margin: 20rpx 0;" @click="submit">提交申请</button>
	
	</view>
</template>

<script>
	import {mapState} from 'vuex';

	export default {
		data() {
			return {
				baseFormData:{
					uid:'',
					access_name:'',
					access_phone:'',
					access_ids:'',
					access_code:'',
					type:1,
					date:'',
					reason:''
				},
				range: [{ value: 1, text: "出校" },{ value: 2, text: "入校" },{ value: 3, text: "出入" },{ value: 4, text: "入出" }]
			};
		},
		computed:{
			...mapState('m_user',['token'])
		},
		methods:{
			selectPick(e){
				console.log(e,e.tempFilePaths)
				this.uploadPick(e.tempFilePaths);
			},
			uploadPick(tempFilePaths){
				let that=this;
				uni.showLoading({
					title:'上传中'
				})
				console.log(tempFilePaths,uni.$http.baseUrl+'/api/file/upload')
				uni.uploadFile({
					url:uni.$http.baseUrl+'/api/file/upload', //文件上传地址
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
							this.baseFormData['access_code']=datas.data.filepath;
							
						}else{
							uni.$showMsg('上传失败')
						}
						
					}
					
				})
			},
			async submit(){
				let params=this.baseFormData;
				
				params['uid']=this.token.uid
				if(params.access_code&&params.access_ids&&params.access_name&&params.access_phone&&params.date&&params.reason){
					let {data}=await uni.$http.post('/api/access/add',this.baseFormData)
					if(data.code!=200)return uni.$showMsg();
					uni.$showMsg(data.message,200);
					this.baseFormData={
							uid:'',
							access_name:'',
							access_phone:'',
							access_ids:'',
							access_code:'',
							type:1,
							date:'',
							reason:''
					}
					
					uni.redirectTo({url:"/userpkg/subpkg_user/user_access/user_access"})
				}
				uni.$showMsg('请完善出入申请信息')
				
			}
			
		},
		onLoad() {
		
		}
	}
</script>

<style lang="scss">
	.file-picker__box{
		margin: 0 !important;
	}
	.add-mok{
		padding: 20rpx;
		.border{
			border-bottom: 1rpx solid $uni-border-color-base;
		}
		.mok-item{
			line-height: 120rpx;
			display: flex;
			height: 120rpx;
			align-items: center;
			input{
				flex: 1;
				margin: 0rpx 30rpx;
			}
			.picker{
				flex: 1;
				margin: 0rpx 30rpx;
			}
			.uni-date-x--border{
				border: none !important;
			}
		}
	}
	
	.add-top{
		margin: 40rpx;
		.top-title{
			font-size: $uni-font-size-title;
		}
		.top-title-hover{
			color: $uni-text-color-grey;
		}
	}
	.add-cont{
		margin: 40rpx;
	}
	.uni-forms-item__label{
		width: auto !important;	
	}
	.access-item{
		display: flex;
		justify-content: space-between;
		.access-item-left{
			flex: 0 0 30%;
		}
		.uni-date {
			flex: 0 0 68%;
		}
		.uni-select__selector{
			z-index: 3;
		}
	}
	.file-picker__box{
		margin: 0 !important;
	}
</style>
