<template>
	<view class="home-input-wrap">
			<text class="left-key">{{keyName}}</text>
			<view class="right-value">
				<input :disabled="disabled" v-if="inputState" type="text" :value="info||valueText" @blur="blurClick"/>
				<text v-else @click="inputState=!inputState">{{info||valueText}}</text>
				<uni-icons class="icon" type="forward"></uni-icons>
			</view>
	</view>
</template>

<script>
	export default {
		props:{
			keyName:{
				type:String,
				default:'KEY'
			},
			valueText:{
				type:String,
				default:'VALUE'
			},
			params:{
				type:String,
				default:''
			},
			disabled:{
				type:Boolean,
				default:false
			}
			
			
		},
		data() {
			return {
				inputState:false,
				info:''
			};
		},
		methods:{
			blurClick(E){
				this.info=E.detail.value;
				this.inputState=!this.inputState;
				let obj={};
				obj[this.params]=this.info
				this.$emit('valueChange',this.params,this.info)
			}
		}
	}
</script>

<style lang="scss">
.home-input-wrap{
	    display: flex;
	    margin: 0rpx 20rpx;
	    height: 80rpx;
	    line-height: 80rpx;
	.left-key{
			 width: 150rpx;
			 text-align: center;
		     letter-spacing: 5rpx;
		     font-size: $uni-font-size-lg;
	}
	.right-value{
		    flex: 1;
		    border-bottom: 0.1rpx solid #e2e2e2;
			height: inherit;
			line-height: inherit;
			text-align: right;
			display: flex;
			align-items: center;
			text{
					display: inline-block;
				    height: inherit;
				    line-height: inherit;
				    color: darkgray;
				    vertical-align: top;
					text-align: right;
					flex: 1;
					overflow: hidden;
			}
			input{
				display: inline-block;
				height: inherit;
				line-height: inherit;
				text-align: left;
				flex: 1;
			}
			.icon{	
					width: 50rpx;
				    display: inline-block;
					vertical-align: middle;
					margin-bottom: -4rpx;
			}
	}
}
</style>
