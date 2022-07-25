<template>
	<view>
		<view class="class-top-wrap">
			<image class="background-wrap" src="http://123.56.144.92:8883/bg1.png" mode="widthFix"></image>
			<view class="class-title">
				<text class="date-week">第{{weekTitle}}周</text>
				<view class="date-select">
					<view class="iconfont icon-arrow-left" @click="backDate()"></view>
					<uni-datetime-picker  class="datepicker" type="date" :clear-icon="false" v-model="single" @change="change" />
					<view class="iconfont icon-arrow-right" @click="forward()"></view>
				</view>
			</view>
		</view>
		
		<view class="class-wrap">
			<block v-if="csList&&csList.length">
				<view class="class-item" v-for="(item,index) in csList" :key="index">
					<view class="item-date">
						<text>{{item.class_date_start}}</text>
						<text class="end">{{item.class_date_end}}</text>
					</view>
					<view class="color-line"></view>
					<view class="item-info">
						<view class="title">{{item.coursename}}</view>
						<view class="hover"><text>第{{item.pitch_num}}节</text>|<text>{{item.class_room}}</text>|<text>{{item.teacher}}</text></view>
					</view>
					<view class="item-right">
						{{datetag(item.pitch_num)}}
					</view>
				</view>
			</block>
			
			<view class="class-none" v-else>
				哇塞~ 	今天没课~
			</view>
		</view>
		
		
		
		
	</view>
</template>

<script>
	import {formatDate} from 'utils/utils';
	import {TodayInfo}  from '../../utils/tools.js'
	import {mapState,mapActions } from 'vuex'
	export default {
		data() {
			return {
				single: "",
				csList:[],
				weekTitle:''
			};
		},
		computed:{
			...mapState('m_user',['token','user']),
			datetag(){
				return function(pitchnum){ //第几节
					  // let arr=["8:00~8.50","9:00~9:50","10:10~11:00","11:10~12:00","14:00~14:50","15:00~15:50","16:10~17:00","17:10~18:00"];
					  //获取当前时间对应的结点数
					 return pitchnum<=4?'上午':'下午'
				}
			}
		},
		mounted() {
			setTimeout(()=>{
				this.single=formatDate()
			},300)
		},
		methods:{
			...mapActions('m_user',['saveUser']),
			change(e){
				this.getCscb(e);
			},
			backDate(){
				this.single=formatDate(-1);
				this.getCscb(this.single);
			},
			forward(){
				this.single=formatDate(1);
				this.getCscb(this.single);
			},
			async getCscb(str){
				//计算当前是第几周
				// {week: 2, day: "星期一"}console.log(TodayInfo("2022-7-11")) classid  week weekday
				let date;
				if(str){ //存在
					 date=new Date(str).Format();
				}else{//不存在则默认当前
					 date=new Date().Format();
				}
				let {data}=await uni.$http.get('/api/mates/cs/gettime');
				if(data.code!=200)return uni.$showMsg(data.message);
				
				let res=TodayInfo(data.data,date);
				if(res.week==null){
					this.csList=[]
					return uni.$showMsg('别开玩笑了，你还没开学呢！！！')
				}
				this.weekTitle=res.week;
				if(this.user&&this.user.classid){ //绑定了班级 进行课程表查询
					let params={
						classid:this.user.classid,
						week:res.week,
						weekday:res.weekday
					}
					let {data}=await uni.$http.post('/api/mates/cs/getcb',params)
					if(data.code!=200)return uni.$showMsg();
					this.csList=data.data;
				}else{
					uni.$showMsg('您当前未绑定班级信息！请绑定');
					// this.gotoSubpage('subpkg/subpkg_user/user_edit/user_edit')
				}
			}
		},
		onLoad() {
			this.getCscb();
		}
	}
</script>

<style lang="scss">
	$colors: red, orange, yellow, green, blue, purple; 
	.background-wrap{
		position: absolute;
		top: 22rpx;
		right: -30%;
		transform: translateX(-50%);
		width: 60%;
		z-index: 99;
	}
	.class-top-wrap{
		background-color: $uni-theme-bg-color;
		position: relative;
		min-height: 200px;
		overflow: hidden;
		.class-title{
			margin: 70rpx 0 0 20rpx;
			color: $uni-text-color-inverse;
			.date-week{
				    margin: 0rpx 0rpx 5rpx 110rpx;
				    display: block;
			}
			.date-select{
				display: flex;
				justify-content: left;
				align-items: center;
				.iconfont{
					font-size: 50rpx;
				}
				.uni-date{
					flex: 0 0 200rpx !important;
				}
				.uni-date-x{
					padding: 0rpx !important;
				}
			}
		}
	}
	
	
	.class-wrap{
		position: relative;
		top: -80px;
		border-top-left-radius: 65rpx;
		border-top-right-radius: 65rpx;
		background-color: $uni-bg-color;
		padding: 50rpx 40rpx;

		@for $i from 1 through length($colors) {
		    .class-item:nth-child(#{length($colors)}n+#{$i}) { 
				.color-line{
					 background: lighten(nth($colors, $i), 20%); 
				}
		    } 
		} 
		
		.class-item{
			display: flex;
			align-items: center;
			margin-bottom: 50rpx;
			
			.item-date{
				text-align: center;
				width: 100rpx;
				text{
					display: block;
				}
				.end{
					color: $uni-text-color-grey;
				}
			}
			.color-line{
				    width: 10rpx;
				    height: 60rpx;
				    border-radius: 20rpx;
				    margin: 0rpx 20rpx;
			}
			.item-info{
				flex: 1;
				.title{
					color: $uni-text-color;
				}
				.hover{
					color: $uni-text-color-grey;
					font-size: $uni-font-size-sm;
				}
			}
			.item-right{
				text-align: center;
				margin-right:20rpx;
				color: $uni-text-color-grey;
			}
		}
	}
		.class-none{
			text-align: center;
			padding-top: 100rpx;
		}
	

</style>
