<template>
	<view>
		<home-moktitle title="每日精选" date="week.2" link="/subpkg/subpkg-choice/subpkg-choice"></home-moktitle>
		<view class="homeposter">
			<view class="poster-item" v-for="item in homeList" :key="item.id" @click="gotoInfo(item.id)">
				<view class="item-img-wrap">
					<image :src="item.cover_img"></image>
				</view>
				<text>{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				homeList:[]
			};
		},
		created() {
			this.getList()
		},
		methods:{
			async getList(){
				let {data}=await uni.$http.get('/api/article/ls/getByw')
				if(data.code!=200)return uni.$showMsg();
				this.homeList=data.data;
				data.data.map(item=>{
					item.cover_img=uni.$http.baseUrl+item.cover_img;
					return item;
				})
			},
			gotoInfo(id){
				console.log(id)
				uni.navigateTo({
					url:'/subpkg/subpkg-choice/choice_info/choice_info?id='+id,
					fail(e) {
						console.log(e)
					}
				})
			},
		}
	}
</script>

<style lang="scss">
.homeposter{
	padding: $uni-them-margin;
	display: flex;
	justify-content: space-between;
	.poster-item{
		width: 48%;
		text-align: center;
		.item-img-wrap{
			border-radius: 12rpx;
			overflow: hidden;
			font-size: 0;
		}
		image{
			 width: 100%;
			 height: 160rpx;
			vertical-align: middle;
		}
		text{
			display: block;
			color: $uni-text-color-grey;
			overflow: hidden;
			font-size: 25rpx;
			max-height: 100rpx;
		}
	}
}
</style>
