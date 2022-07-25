<template>
	<view>
		<block v-if="historylist&&historylist.length">
			<view class="history-item" v-for="item in historylist" :key="item.id" @click="showQrcode(item)">
				<view class="history-user">
					<uni-icons class="icon" type="contact" size="20"></uni-icons>
					<text>{{item.access_name}}</text> <text class="tag pass">同意</text>
				</view>
				<view class="history-cont">
					<view class="class">{{gettype(item.type)}}</view>
					<view class="hover">时间段：{{item.enter_date}} {{item.out_date}}</view>
					<view class="hover">缘由：{{item.reason}}</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view style="margin-top: 100rpx; text-align: center;">
				<image style="width: 400rpx;" src="http://123.56.144.92:8883/none2.png" mode="widthFix"></image>
				<view>暂时什么都没有....</view>
			</view>
		</block>
			
		<uni-popup ref="alertDialog" type="dialog" backgroundColor="#fff">
			<view class="popup-content">
				<canvas id="qrcode" canvas-id="qrcode" style="width: 250px; height: 250px;" ></canvas>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import  '@/utils/utils.js'
	import {mapState} from 'vuex';
	
	import uQRCode from '@/utils/js_sdk/u-qrcode/u-qrcode.js';
		// const qrcode=require('@/utils/weapp-qrcode.js')
	export default {
		data() {
			return {
				msgType:false,
				historylist:[]
			};
		},
		computed:{
			...mapState('m_user',['token']),
			gettype(type){
				return function(type){
					if(type==1)return '出校'
					if(type==2)return '入校'
					if(type==3)return '出入学校'
					if(type==4)return '入出学校'
				}
			}
		},
		methods:{
			async getHistory(){
				let {data}=await uni.$http.post('/api/access/agree/get',{uid:this.token.uid});
				if(data.code!=200)return uni.$showMsg(data.message);
				this.historylist=data.data;
				data.data.map(item=>{
					item['enter_date']=(item.enter_date&&new Date(item.enter_date).Format())||'';
					item['out_date']=(item.out_date&&new Date(item.out_date).Format())||''
					return item
				})
			},
			buildQrcode(text){
				const ctx = uni.createCanvasContext('qrcode');
				const uqrcode = new uQRCode({text,size:250},ctx);
				uqrcode.make();
				uqrcode.draw();
			},
			showQrcode(obj){
				this.msgType =!this.msgType
				this.$refs.alertDialog.open();
				let qrcode={
					id:obj.id, //申请id
					uid:obj.uid, //用户id
					type:obj.type,//出入类型
					date:{ //出入时间
						enter_date:obj.enter_date?obj.enter_date:'',
						out_date:obj.out_date?obj.out_date:''
					}
				}
				console.log('二维码信息'+qrcode)
				this.buildQrcode(JSON.stringify(qrcode));
			}
		},
		onLoad() {
			this.getHistory();
		}
	}
</script>

<style lang="scss">
page{
		background-color: $uni-theme-bg-basec;
	}
	.history-item{
		background-color: #fff;
		padding: 30rpx;
		margin: 20rpx;
		border-radius: $uni-border-radius-base;
		.history-user{
			&>.icon{
				vertical-align: middle;
			}
			&>.tag{
				border: 1rpx solid #ff5500;
				color: #ff5500;
				background-color: #fff4f2;
				border-radius: 40rpx;
				font-size: 20rpx;
				padding: 5rpx;
				margin-left: 8rpx;
				vertical-align: middle;
				&.pass{
					border: 1rpx solid #38dc3f;
					color: #fff4f2;
					background-color: #38dc3f;
					
				}
				&.check{
					border: 1rpx solid #E91E63;
					color: #fff4f2;
					background-color: #E91E63;
				}
				&.reject{
					color: #fff4f2;
					border: 1rpx solid #ff5500;
					background-color: #ff5500;
				}
			}
		}
		.history-cont{
			margin-top: 10rpx;
			&>.class{
				color: #333;
				font-size: $uni-font-size-base;
			}
			&>.hover{
				color: $uni-text-color-grey;
				font-size: $uni-font-size-sm;
			}
		}
	}
	
	.popup-content {
			position: relative;
			align-items: center;
			padding: 15px;
			background-color: #fff;
	}
</style>
