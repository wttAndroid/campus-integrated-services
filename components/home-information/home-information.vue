<template>
	<view>
		<home-moktitle title="今日资讯" date="01.29" link="/subpkg/subpkg_infor/subpkg_infor"></home-moktitle>
		<view class="infor-list">
			<view class="infor-item" v-for="item in infoList" @click="navigateTo(item.id)" :key="item.id">
				<view style="display: flex;">
					<text v-if="item.tag>0" :class="['infor-tag',item.tag>1?'tag':'']">{{getTag(item.tag)}}</text>
					<text class="infor-title">{{item.title}}</text>
				</view>
				<text class="infor-text">{{item.hover}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				infoList:[]
			};
		},
		computed:{
			getTag(){
				return function(tag){
					if(tag==2) return '置顶'
					if(tag==1) return '热门'
					if(tag==0) return ''
				}
			}
		},
		methods:{
			async getinfomation(){
				let {data}=await uni.$http.get('/api/information/getfont');
				if(data.code!=200)return uni.$showMsg(data.message);
				this.infoList=data.data;
			},
			navigateTo(id){
				uni.navigateTo({
					url:'/subpkg/subpkg_infor/infor_info/infor_info?id='+id
				})
			}
		},
		created() {
			this.getinfomation();
		}
	}
</script>

<style lang="scss">
	.infor-list{
		padding:$uni-them-margin;
		.infor-item{
			padding:20rpx 0rpx;
			&:not(:last-child){
				border-bottom: 1rpx solid $uni-border-color;
			}
			.infor-tag{
				background-color: $uni-bg-color-tag;
				padding: 1rpx 5rpx;
				margin-right: 8rpx;
				color: $uni-text-color-inverse;
				border-top-left-radius: 20rpx;
				border-bottom-right-radius: 20rpx;
				font-size: $uni-font-size-sm;
				
				&.tag{
					background-color: $uni-bg-color-tagg;
				}
			}
			.infor-title{
				flex: 1;
					text-overflow: ellipsis;
				    word-break: break-all;
				    overflow: hidden;
				    white-space: nowrap;
					color: $uni-text-color;
			}
			.infor-text{
					text-overflow: ellipsis;
				    word-break: break-all;
				    overflow: hidden;
				    white-space: nowrap;
					color: $uni-text-color-grey;
					font-size: $uni-font-size-sm;
					word-spacing: 5rpx;
					display: block;
			}
		}
	}
	

</style>
