<template>
	<view class="home-top-wrap">
		<view class="home-top-bg"></view>
		<view class="top-title-wrap">
			<text>{{weekTitle}}</text>
			<view class="iconfont icon-icon_tianjia" @click="navigateTo('/subpkg/subpkg_class/subpkg_class')"></view>
		</view>
		
		<view class="top-card-wrap">
			<block  v-if="csList&&csList.length">
				<view class="card-item" v-for="(item,index) in csList" :key="index">
						<view>
							<text class="carditem-tag">{{datetag(item.pitch_num)}}</text>
							<text class="carditem-title">{{item.coursename}}</text>
						</view>
						<text class="carditem-date">{{item.class_date_start}}~{{item.class_date_end}}</text>
				</view>
			</block>
			<view v-else>
				{{cshover}}
			</view>
		</view>
		<view class="top-swiper-wrap">
			<swiper class="swiper-wrap" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<block v-if="swiperList&&swiperList.length">
					<swiper-item v-for="item in swiperList" :key="item.id" @click="gotoNav(item.image_url)">
						<view class="swiper-item">
							<image :src="item.src" mode="scaleToFill"></image>
						</view>
					</swiper-item>
				</block>
				<block>
					<swiper-item >
						<view class="swiper-item">
							<image src="http://123.56.144.92:8883/banner.jpeg" mode="scaleToFill"></image>
						</view>
					</swiper-item>
				</block>
			</swiper>
		</view>
		
	</view>
</template>

<script>
	
	import {TodayInfo}  from '../../utils/tools.js'
	import {mapState } from 'vuex'
	export default {
		data() {
			return {
				weekTitle:"你好呀~",
				cshover:'今天也是元气满满的一天哦!~~',
				swiperList:[],
				csList:[]
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
		methods:{
			navigateTo(link){
				uni.navigateTo({
					url:link
				})
			},
			//轮播图列表
			async getSwitchList(){
				let {data}=await uni.$http.get('/api/public/banner/get?is_show=1&open_type=HOMETOP&start_time='+new Date().Format());
				if(data.code!=200)return uni.$showMsg();
				this.swiperList=data.data.map((item)=>{
					item['src']=uni.$http.baseUrl+item['filepath']
					return item
				})
			},
			gotoNav(url){
				console.log('跳转到'+url)
			},
			async getCscb(){
				let date=new Date().Format();
				let {data}=await uni.$http.get('/api/mates/cs/gettime');
				if(data.code!=200)if(data.code!=200)return uni.$showMsg(data.message);
				
				let res=TodayInfo(data.data,date);//获取今天的时间信息
				this.weekTitle=res.day;
				if(this.user&&this.user.classid){ //绑定了班级 进行课程表查询
					let params={
						classid:this.user.classid,
						week:res.week,
						weekday:res.weekday
					}
					let {data}=await uni.$http.post('/api/mates/cs/getcb',params)
					if(data.code!=200)return uni.$showMsg();
					this.csList=data.data.slice(0,2)  //只截取前2个
					this.cshover='今天也是元气满满的一天哦!~~'
				}else{
					this.cshover='您当前未绑定班级信息，无法查看课表！'
				}
			}
		},
		created() {
			this.getSwitchList();
			this.getCscb();
		}
		// onLoad() {
		// 	this.getSwitchList();
		// 	this.getCscb();
		// }
	}
</script>

<style lang="scss" scoped>
	.home-top-bg{
		position: absolute;
		top: 0;
		left: -25%;
		width: 150%;
		height: 350rpx;
		border-bottom-left-radius: 100%;
		border-bottom-right-radius: 100%;
		z-index: -1;
		background-image: linear-gradient(125deg,$uni-theme-bg-color,$uni-theme-bg-color 65%);
	}
	
	.home-top-wrap{
		position: relative;
		padding: 40rpx;
		height: 350rpx;
		color: $uni-text-color-inverse;
		.top-title-wrap{
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			font-size: $uni-font-size-title;
		}
		
		.top-card-wrap{
			display: flex;
			background-color: rgba($color: $uni-bg-color, $alpha: 0.15);
			border-radius: $uni-border-radius-lg;
			margin: 20rpx 0;
			padding: 20rpx 15rpx;
			min-height: 100rpx;
			.card-item{
				    flex: 0 0 50%;
				    width: 0;
				.carditem-tag{
					background-color: pink;
					padding: 1rpx 5rpx;
					margin-right: 5rpx;
					border-radius: 10rpx;
					text-align: center;
				}
				.carditem-title{
					text-overflow: ellipsis;
					    word-break: break-all;
					    overflow: hidden;
					    white-space: nowrap;
				}
				.carditem-date{
					
				}
			}
		}
		
		.top-swiper-wrap{
			border-radius: $uni-border-radius-lg;
			overflow: hidden;
			position: relative;
			.swiper-wrap{
				height: 250rpx;
			}
			.swiper-item{
				image{
					width: 100%;
					font-size: 0;
					height: 500rpx;
				}
			}
		}
	}
			
</style>
