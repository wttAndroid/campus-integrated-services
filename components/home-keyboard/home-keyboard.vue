<template>
	<view class="chat-input-wrap">
			<view class="input-text-wrap">
				<view class="button-wrap">
					<input  :cursor="cursornum" @blur="blurEvent" v-model="text" type="text" value="" />
				</view>
				<span  class="but-emoji" @click="showemoji=!showemoji">😀</span>
				<button  size="mini" @click="sendClick" type="primary">发送</button>
			</view>
			<view class="input-other-wrap" v-show="showemoji">
				<swiper class="slider" >
				    <swiper-item v-for="(item, key) in emojiData" :key="key" class="slider-emoji" :class="[key==emojiData.length-1?'lastbox':'']">
				        <text v-for="(emoji, index) in item" :key="index" @click="selemoji(emoji)" class="slider-emoji-icon">{{ emoji }}</text>
				    </swiper-item>
				</swiper>
			</view>
		</view>
</template>

<script>
	import emoji from '@/static/emoji'
	export default {
		data() {
			return {
				emojiData:[],
				cursornum:0,
				showemoji:false,
				text:""
			};
		},
		methods:{
			sendClick(){
				this.$emit('sendEvent',this.text)
			},
			clear(){
				this.cursornum=0;
				this.text='';
			},
			initemoji(){
				let  emojilist=[]
				//一共
				let page=Math.ceil(emoji.length/60)
				for(let i=0;i<page;i++){
					emojilist[i]=[];
					for(let k=0;k<60;k++){
						emoji[i*60+k]?emojilist[i].push(emoji[i*60+k]):''
					}
				}
				this.emojiData=emojilist
			},
			selemoji(val) {
				 // 返回获取从0到光标位置的字符串
				 let str = this.text.substring(0,this.cursornum);
				 this.text = this.text.replace(str,str + val)
				 this.cursornum += 2; //光标加2(表情是占两个位置)
			},
			blurEvent(e){
				this.cursornum=e.target.cursor
			}
		},
		created() {
			this.initemoji()
		}
	}
</script>

<style lang="scss">
	.slider {
	  width: 375;
	  height: 300rpx;
	    &-emoji {
	        width: 375;
	        flex-direction: row;
	        flex-wrap: wrap;
	        justify-content:center;
	        &-icon {
	               width: 10%;
	               display: inline-block;
	               text-align: center;
	               padding: 10.5 0;
	               font-size: 35rpx;
	        }
	    }
	}
	
.chat-input-wrap{
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #f7f7f7;
	.input-text-wrap{
		border-top: 1rpx solid $uni-border-color;
		height: 100rpx;
		display: flex;
		align-items: center;
		padding: 0rpx 10rpx;
		&>button{
			width: 150rpx;
		}
		.iconfont{
			    margin: 0rpx 10rpx;
			    font-size: 40rpx;
		}
		.button-wrap{
			flex: 1;
			input{
				background: white;
				height: 70rpx;
				border-radius: 5rpx;
			}
		}
		.but-emoji{
			margin: 0rpx 10rpx;
			font-size: 40rpx;
		}
	}
	
}
</style>
