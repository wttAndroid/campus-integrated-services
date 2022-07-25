<template>
	<view class="mok-title">
		<view class="left">
			<text class="title">{{title}}</text>
			<text class="grey">{{date}}</text>
		</view>
		<view  @click="gotoPages">
			<text class="grey">更多</text>
			<uni-icons class="grey" type="forward"></uni-icons>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			title:{
				default:'',
				type:String
			},
			link:{
				default:'',
				type:String
			},
			date:{
				default:'',
				type:String
			}
		},
		methods:{
			gotoPages(){
				
				uni.navigateTo({
					url:this.link,
					fail(err) {
						console.log(err,this.link)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.mok-title{
	margin: 15rpx 40rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	.left{
		&::after{
			position: absolute;
			top: 25%;
			    content: '';
			    left: 0rpx;
			    height: 50%;
			    width: 8rpx;
				border-radius: 5rpx;
			    z-index: 1;
				background-color:$uni-theme-bg-color;
		}
	}
	.title{
		font-weight: bold;
		margin:0rpx 10rpx;
		padding-left: 15rpx;
		font-size: $uni-font-size-paragraph;
		color: $uni-text-color;
	}
	.grey{
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
		text{
			color: $uni-text-color-grey !important;
			vertical-align: bottom;
		}
	}
}
</style>
