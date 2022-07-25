<template>
	<view>
		<view class="add-mok">
			<view class="mok-item border">
				<text>标题</text>
				<input type="text" placeholder="请输入文章标题" v-model="baseFormData.title">
				<view class="iconfont icon-arrow-right"></view>
			</view>
			
			<view class="border">
				<textarea v-model="baseFormData.content"   placeholder="简诉一下您要发表文章内容" />
			</view>
			<view>
				<view class="example-body">
					<uni-file-picker @select="selectPic" @delete="deletepic" return-type="object"  fileMediatype="image"  ref="files" :auto-upload="false" limit="1" title="最多选择1张图片"></uni-file-picker>
				</view>
			</view>
			<view class="mok-item border">
				<text>类型</text>
				<uni-data-checkbox class="picker" mode="tag" v-model="baseFormData.cid" :localdata="catelist"></uni-data-checkbox>
			</view>
			<button class="submit-button" type="primary" @click="submit">确定发布</button>
		</view>
		<home-margin-bar></home-margin-bar>
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				catelist: [],
				imageValue:null,
				baseFormData:{
					cid:null,
					title:'',
					content:'',
					cover_img:'',
					author_id:''
				}
			};
		},
		computed:{
			...mapState('m_user',['token'])
		},
		methods:{
			selectPic(e){
				this.imageValue=e.tempFilePaths[0];
			},
			deletepic(){
				this.imageValue=null;
			},
			async getcateList(){
				let {data}=await uni.$http.get("/api/article/cate/get");
				if(data.code!=200) return uni.$showMsg(data.message);
				this.catelist=data.data.map(item=>{
					item['value']=item.id
					item['text']=item.name
					return item;
				})
				
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
			async submit(){
				if(!(this.token&&this.token.uid))return uni.$showMsg('请先登录！');
				let params=this.baseFormData;
				params.author_id=this.token.uid;
				if(params.cid&&params.content&&params.title){
					if(this.imageValue){
						params.cover_img=await  this.formatPic(this.imageValue);
					}
					let {data}=await uni.$http.post('/api/article/ls/add',params);
					if(data.code!=200)return uni.$showMsg('发布失败！');
					
					uni.$showMsg('发布成功！');
					uni.redirectTo({url:'/subpkg/subpkg-choice/subpkg-choice'})
				}else{
					return uni.$showMsg('请完善必要的发布信息！');
				}
			}
		},
		onLoad() {
			this.getcateList()
		}
	}
</script>

<style lang="scss">
.add-mok{
	padding: 20rpx;
	.border{
		border-bottom: 1rpx solid $uni-border-color-base;
		textarea{
			    min-height: 500rpx;
			    width: 100%;
		}
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
.file-picker__box{
	margin: 0 !important;
}
</style>
