<template>
	<view>
	<view class="example-body">
						<view class="uni-box-head">
							<uni-title  type="h1" align="left" :title="infopage.title"></uni-title>
						</view>
						<text class="hover-text">发布:{{infopage.create_time}} 		来源：{{infopage.author}}</text>
						<view class="hover">
							{{infopage.hover}} 	
						</view>
						<image :src="infopage.cover_img" mode="widthFix"></image>
						<view class="text-content">
							<rich-text :nodes="infopage.content"></rich-text>
							
						</view> 
					</view> 	
		 </view>
		 
</template>

<script>
	import  '@/utils/utils.js'
	export default {
		data() {
			return {
				infopage:{}
			};
		},
		methods:{
			async getinfopage(id){
				let {data}=await uni.$http.get('/api/information/info/get?id='+id);
				if(data.code!=200)return uni.$showMsg(data.message);
				data.data['cover_img']=uni.$http.baseUrl+data.data['cover_img'].replace(/\\/g,'/')
				data.data['create_time']=new Date(data.data['create_time']).FormatDate()
				this.infopage=data.data;
			}
		},
		onLoad(options) {
			this.getinfopage(options.id)
		}
	}
</script>

<style lang="scss">

.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 10px;
	}

	.uni-text {
		font-size: 14px;
		line-height: 22px;
		color: #333;
	}
	.hover{
			font-size: 26rpx;
		    margin: 20rpx 0;
		    border-bottom: 1rpx dashed $uni-border-color;
		    padding: 20rpx 0;
		    border-top: 1rpx dashed $uni-border-color;
			color: $uni-text-color-grey;
	}
	.hover-text{
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
	}
	.text-content{
		
	}
	
</style>
