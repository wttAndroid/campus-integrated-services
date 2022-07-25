<template>
	<view>
		<view class="add-cont">
			<uni-forms ref="baseForm"  label-position="top">
				<uni-forms-item label="01.体温" required>
					<uni-easyinput type="number" v-model="baseFormData.temp" placeholder="请输入体温数据" />
				</uni-forms-item>
				<uni-forms-item label="02.说明" required>
						<uni-easyinput type="textarea" v-model="baseFormData.hover" placeholder="当您的体温高于27.3摄氏度时,请对情况进行说明" />
				</uni-forms-item>
				<button v-if="issubmit"  type="primary" style="margin: 20rpx 0;" @click="editsubmit">重新上报</button>
				<button v-else type="primary" style="margin: 20rpx 0;" @click="submit">上报</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				issubmit:false, //未上报
				baseFormData:{
					id:'',
					temp:'',
					hover:''
				}
			};
		},
		computed:{
			...mapState('m_user',['token']),
		},
		methods:{
			async submit(){
				this.baseFormData['uid']=this.token.uid;
				let {data}=await uni.$http.post('/api/access/temp/add',this.baseFormData)
				if(data.code!=200)return uni.$showMsg(data.message);
				uni.$showMsg('上报成功！');
				uni.navigateBack()
			},
			async editsubmit(){
				this.baseFormData['uid']=this.token.uid;
				let {data}=await uni.$http.post('/api/access/temp/edit',this.baseFormData)
				if(data.code!=200)return uni.$showMsg(data.message);
				uni.$showMsg('编辑成功！');
				uni.navigateBack()
			},
			async gettimep(){ 
				//this.token.uid
				let {data}=await uni.$http.post('/api/access/temp/get',{uid:this.token.uid})
				if(data.code==200&&data.data&&data.data.length){
					this.baseFormData=data.data[0];
					this.issubmit=true //已经上报
					return uni.$showMsg('今日已上报！');
				}
				
			}
		},
		onLoad() {
			this.gettimep();
		}
	}
</script>

<style lang="scss">
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
