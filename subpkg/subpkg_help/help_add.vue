<template>
	<view>
		<home-margin-bar></home-margin-bar>
		<view class="add-mok">
			<view class="border">
				<textarea v-model="baseFormData.title"   placeholder="简诉一下您要寻求的帮助内容" />
			</view>
			<view>
				<view class="example-body">
					<uni-file-picker @select="selectPic" @delete="deletepic" return-type="object"  fileMediatype="image"  ref="files" :auto-upload="false" limit="1" title="最多选择1张图片"></uni-file-picker>
				</view>
			</view>
			<view class="mok-item">
				<view @click="goMap" class="iconfont icon-icon_dingwei"></view>
				<input type="text"  placeholder="请输入地址" v-model="baseFormData.task_address.name" />
			</view>
		</view>
		<home-margin-bar></home-margin-bar>
		
		<view class="add-mok">
			<view class="mok-item border">
				<text>价格</text>
				<input v-model="baseFormData.money" type="number" maxlength="11" placeholder="请输入价格">
				<view class="iconfont icon-arrow-right"></view>
			</view>
			<view class="mok-item border">
				<text>类型</text>
				<uni-data-checkbox class="picker" mode="tag" v-model="baseFormData.task_type" :localdata="typetag"></uni-data-checkbox>
			</view>
			<view class="mok-item border">
				<text>联系人</text>
				<input v-model="baseFormData.task_contact" type="text" maxlength="30" placeholder="请输入联系人">
				<view class="iconfont icon-arrow-right"></view>
			</view>
			
			<view class="mok-item border">
				<text>时间</text>
				<input  v-model="baseFormData.task_time" type="text" placeholder="请简述一下任务时间">
				<view class="iconfont icon-arrow-right"></view>
			</view>
			<view class="mok-item border">
				<text>备注</text>
				<input type="text" placeholder="请输入备注" v-model="baseFormData.task_remark">
				<view class="iconfont icon-arrow-right"></view>
			</view>
			<view class="mok-item border">
				<text>截至时间</text>
				<uni-datetime-picker :start="new Date().FormatDate()" class="picker" placeholder="请选择截至时间" type="datetime" return-type="string" v-model="baseFormData.end_time"/>
			</view>
			
			
			<button class="submit-button" type="primary" @click="submit">确定发布</button> 
		</view>
		 <!-- <w-compress ref='wCompress' /> -->
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				imageValue:null,
				baseFormData:{
					title:'',
					task_remark:'',
					task_time:'',
					task_contact:'',
					task_address:{
						name:''
					},
					end_time:'',
					money:0.0,
					task_type:0,
					task_pic:''
				},
					typetag: [		{
									text: '快递',
									value: 0
								},{
									text: '外卖',
									value: 1
								}, {
									text: '排队',
									value: 2
								}, {
									text: '其他',
									value: 3
								}],
				address:{},
				rules:{
					money:{
						rules:[
							{
								required: true,
								errorMessage: '请填写佣金',
							}
						]
					}
				}
			};
		},
		computed:{
			...mapState('m_user',['token'])
		},
		onReady() {
			 // this.$refs.baseForm.setRules(this.rules);
		},
		methods:{
			selectPic(e){
				this.imageValue=e.tempFilePaths[0];
			},
			 formatPic(path){
				let that=this;
				return new Promise((resolve,reject)=>{
					 uni.uploadFile({
						url:uni.$http.baseUrl+'/api/file/upload',
						filePath:path,
						name:'file',
						header:{
							Authorization:that.token.tokenn,
							"Content-Type":"multipart/form-date"
						},
						formData:{
							group_type:3
						},
						success:(res)=>{
							let datas=JSON.parse(res.data)
							if(datas.code==200){
								console.log(res,'上传成功');
								resolve(datas.data.filepath)
							}else{
								console.log('上传失败')
								reject(datas.message)
							}
						}
					})
				})
				
			},
			deletepic(){
				this.imageValue=null;
			},
			shouquan(){
				uni.authorize({
				    scope: 'scope.userLocation',
				    success() {
				        uni.getLocation()
				    }
				})
			},
			goMap(){
				let that=this;
				uni.authorize({
				    scope: 'scope.userLocation',
				    success(res) {
				      uni.chooseLocation({
						  success:function(res){
							  // that.address=res;
							  that.baseFormData['task_address']=res;
						  }
					  })
				    }
				})
			},
			changeevent(value){
				this.baseFormData['task_address']={
					name:value,
					latitude:'',
					longitude:''
				}
			},
			async submit(){
				if(!(this.token&&this.token.uid))return uni.$showMsg('请先登录！');
				let params=this.baseFormData;
				params.uid=this.token.uid;
				if(params.title&&params.task_address.name&&params.task_contact&&params.end_time&&params.task_time){
					if(this.imageValue){
						params.task_pic=await  this.formatPic(this.imageValue);
					}
					let {data}=await uni.$http.post('/api/task/add',params);
					if(data.code!=200)return uni.$showMsg('发布失败！');
					
					uni.$showMsg('发布成功！');
					uni.redirectTo({url:'./subpkg_help'})
				}else{
					return uni.$showMsg('请完善必要的发布信息！');
				}
			}
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






</style>
