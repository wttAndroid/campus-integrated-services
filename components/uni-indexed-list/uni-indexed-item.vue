<template>
	<view>
		<view v-if="loaded || list.itemIndex < 15" class="uni-indexed-list__title-wrapper">
			<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title">{{ list.key }}</text>
		</view>
		<view v-if="(loaded || list.itemIndex < 15) && list.items && list.items.length > 0" class="uni-indexed-list__list">
			<view v-for="(item, index) in list.items" :key="index" class="uni-indexed-list__item" hover-class="uni-indexed-list__item--hover">
				<view class="user-item"  @click="onClick(idx, index)">
					<view :class="['user-img',item.name.state!=-1?'active':'']">
						<image :src="filepicker(item.name.user_pic)" ></image>
					</view>
					<text class="user-name">{{item.name.username}}</text>
					<!-- <text class="user-phone">18334652443</text> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniIndexedList',
		emits:['itemClick'],
		props: {
			loaded: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		computed:{
			filepicker(){
				return (photo)=>{
					return uni.$http.baseUrl+photo
				}
			}
		},
		methods: {
			onClick(idx, index) {
				this.$emit("itemClick", {
					idx,
					index
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.user-item{
			display: flex;
			padding: 40rpx;
			align-items: center;
			
			.user-img{
					width: 80rpx;
					height: 80rpx;
					position: relative;
					&>image{
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
					}
					&.active::after{
						content: '';
						position: absolute;
						bottom: 0;
						right: 0;
						width: 20rpx;
						height: 20rpx;
						border-radius: 50%;
						background-color: #55ff17;
					}
				}
				.user-name{
					margin-left: 20rpx;
				}
				.user-phone{
					margin-left: 10rpx;
					color: $uni-text-color-grey;
				}
				
		}
	.uni-indexed-list__list {
		background-color: $uni-bg-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #DEDEDE;
		margin: 10rpx 20rpx;
		    box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
		    border-radius: 15rpx;
	}

	.uni-indexed-list__item {
		font-size: 14px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-container {
		padding-left: 15px;
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-indexed-list__item-border {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		padding: 25px;
		padding-left: 0;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		// border-bottom-color:  #DEDEDE;
	}

	.uni-indexed-list__item-border--last {
		border-bottom-width: 0px;
	}

	.uni-indexed-list__item-content {
		flex: 1;
		font-size: 14px;
		color: #191919;
	}

	.uni-indexed-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__title-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		background-color: #f7f7f7;
	}

	.uni-indexed-list__title {
		padding: 6px 16px;
		line-height: 10px;
		font-size: 13px;
		font-weight: 500;
		color: #aaa;
	}
	
	
</style>
