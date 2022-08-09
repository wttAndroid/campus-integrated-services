<template>
	<view>
		<view class="info-top">
			<view class="info-user">
				<image class="" :src="articleInfo.user_pic"></image>
				<view class="choice-item-right">
					<text class="right-title">{{articleInfo.username}}</text>
					<view  class="right-other">
						{{articleInfo.pub_date}}
					</view>
				</view>
			</view>
			<view class="info-content">
				{{articleInfo.title}}
				<image :src="articleInfo.cover_img"></image>
				<rich-text style="word-break: break-word;" :nodes="articleInfo.content||''"></rich-text>
				
			</view>
			<view style="text-align: right;">
				<view @click="addComment(articleInfo.id)" class="tag iconfont icon-icon_xiaoxi_1"></view>
				<view class="tag iconfont icon-icon_zan"></view>
			</view>
		</view>
		<home-margin-bar></home-margin-bar>
		<view class="info-wrap">
			<view class="info-tab-wrap">
				<text :class="[activeTab==1?'active':'']" @click="clickTab(1)">最新</text>
				<text :class="[activeTab==2?'active':'']" @click="clickTab(2)">热评</text>
			</view>
			<view class="info-list-wrap">
				<block v-if="artinfoList&&artinfoList.length">
					<view class="info-item" v-for="item in artinfoList" :key="item.id">
						<image :src="item.user_pic" mode="widthFix"></image>
						<view class=".choice-item-right">
							<view class="right-title">{{item.username}}</view>
							
							<view class="right-content">
								{{item.content}}</view>
							
							<view class="right-other">
								<text>{{item.create_time}}</text>
								<view class="tag iconfont icon-icon_zan"></view>
								<view @click="addCommentLs(item.id,item.aid)" class="tag iconfont icon-icon_xiaoxi_1"></view>
							</view>
							<view class="right-comment"  v-if="item.comlist&&item.comlist.length">
								<view class="comment-item" v-for="item2 in item.comlist" :key="item2.id">
									<text class="user" @click="addComLsByw(item2.sendid,item.id,item.aid)">{{item2.sendname}}</text>
									<view v-if="item2.receiveid">回复
										<text class="user" @click="addComLsByw(item2.receiveid,item.id,item.aid)">{{item2.receivename}}</text>
									</view>：{{item2.content}}
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else  >
					<view style="margin-top: 100rpx; text-align: center;">
						暂时什么都没有....
					</view>
				</block>
			</view>
		</view>
			
		<uni-popup ref="share" type="share" safeArea>
		
				<view class="pop-wrap">
				<home-keyboard ref="keyboard" class="keyboard" @sendEvent="sendEvent"></home-keyboard>
				</view> 
		</uni-popup>
	</view>
</template>

<script>
	import { mapState} from 'vuex'
	export default {
		data() {
			return {
				aid:null,
				activeTab:1,
				artinfoList:[],
				articleInfo:null,
				sendParams:{},
				type:1,
				total:0,
				pagenum:0
			};
		},
		computed:{
			...mapState('m_user',['token']),
			create_date(){
				return function(str){
					let date=new Date(str).FormatDate();
					return date
				}
			},
		},
		methods:{
			addComment(aid){ //添加文章评论
				this.$refs.share.open();
				this.type=1
				this.sendParams={aid,uid:this.token.uid}
			},
			addCommentLs(comid,aid){ //添加评论的评论  
				this.$refs.share.open();
				this.type=2
				this.sendParams={sendid:this.token.uid,comid,aid};
			},
			addComLsByw(uid,comid,aid){
				this.$refs.share.open();
				this.type=2
				this.sendParams={sendid:this.token.uid,receiveid:uid,comid,aid};
			},
			sendEvent(value){
				if(this.sendParams&&value){
					this.sendParams['content']=value;
					if(this.type==1){
						this.addCommentRequest(this.sendParams)
					}else if(this.type==2){
						this.addCommentLsRequest(this.sendParams)
					}
				}
			},
			async addCommentRequest(params){
				let {data}=await uni.$http.post('/api/article/art/add',params);
				if(data.code!=200) return uni.$showMsg(data.message);
				uni.$showMsg(data.message);
				this.close()
			},
			close(){
				this.$refs.share.close();
				this.sendParams={}, //初始化
				this.type=1;
				this.$refs.keyboard.clear()
				this.getChiceInfo();
				this.getArticleLs();
			},
			async addCommentLsRequest(params){
				let {data}=await uni.$http.post('/api/article/art/acl/add',params);
				if(data.code!=200) return uni.$showMsg(data.message);
				uni.$showMsg(data.message);
				this.close()
			},
			clickTab(id){
				this.activeTab=id;
				this.init();
				this.getChiceInfo();
			},
			init(){
				this.pagenum=0;
				this.total=0;
				this.artinfoList=[]
			},
			async getChiceInfo(){
				if(this.total<this.pagenum*10)return uni.$showMsg('已经加载到底部了！');
				this.pagenum=this.pagenum+1 //更换当前页数
				
				let {data}=await uni.$http.get('/api/article/art/getbyw?aid='+this.aid+'&sort='+this.activeTab+'&pagenum='+this.pagenum);
				if(data.code!=200)return uni.$showMsg();
				let {total,list}=data.data;
				
				list.map(item=>{
					item.user_pic=uni.$http.baseUrl+item.user_pic;
					return item;
				})
				this.artinfoList=list;
				this.total=total;
			},
			async getArticleLs(){
				let {data}=await uni.$http.get('/api/article/art/getbyid?id='+this.aid);
				if(data.code!=200)return uni.$showMsg();
				data.data.map(item=>{
					item.cover_img=uni.$http.baseUrl+item.cover_img;
					item.user_pic=uni.$http.baseUrl+item.user_pic;
					return item;
				})
				this.articleInfo=data.data[0];
			}
		},
		onReachBottom() {
			this.getChiceInfo();
		},
		onLoad(options) {
			this.aid=options.id
			this.getChiceInfo();
			this.getArticleLs();
		}
	}
</script>

<style lang="scss">
	.pop-wrap{
		background-color: #fff;
		width: 100%;
		box-sizing: border-box;
	}
	.choice-item-right{
		flex: 1;
		min-width: 0;
		margin-left: 20rpx;
		.right-title{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			display: block;
			font-size: $uni-font-size-base;
		}
		.right-other{
				color: $uni-text-color-grey;
				font-size: $uni-font-size-ssm;
				.tag{
					color: $uni-them-font-color;	
				}
		}
	}
	
	.info-top{
		padding: 20rpx;
		.info-user{
			display: flex;
			align-items: center;
			background-color: $uni-bg-color;
			border-radius: 20rpx;
			&>image{
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}
		}
		.info-content{
			overflow: hidden;
			padding: 50rpx 20rpx;
		}
		.tag{
			margin-right: 15rpx;
			font-size: $uni-font-size-lg;
			color: $uni-them-font-color;
		}
	}
	.info-tab-wrap{
		text{
			    width: 100rpx;
			    text-align: center;
			    display: inline-block;
				position: relative;
				height: 50rpx;
				line-height: 50rpx;
			&.active{
				&::after{
					content: '';
					    width: 50%;
					    bottom: -5rpx;
					    height: 5rpx;
					    background-color: $uni-theme-bg-color;
					    position: absolute;
					    left: 50%;
					    transform: translateX(-50%);
					
				}
			}
		}
	}
	.info-wrap{
		padding: 20rpx;
		.info-list-wrap{
			.info-item{
				display: flex;
				padding: 20rpx 0;
				&:not(:last-child){
					border-bottom: 1rpx solid $uni-border-color-base;
				}
				&>image{
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}
				.info-item-right{
					display: flex;
				}
				
				.right-content{
					overflow: hidden;
					margin: 10rpx 0;
				}
				.tag{
					float: right;
					margin-right: 15rpx;
					font-size: $uni-font-size-lg;
				}
				.right-comment{
					font-size: $uni-font-size-sm;
					background: $uni-bg-color-grey;
					padding: 10rpx;
					.comment-item{
						view{
							display: inline-block;
						}
						.user{
							color: $uni-them-font-color;
						}
					}
				}
			}
		}
	}
	
// .choice-top{
// 		padding: 20rpx;
// 		min-height: 220rpx;
// 		display: flex;
// 		flex-direction: column;
// 		justify-content: space-between;
// 		// background: #4cd7e0;
// 		background-repeat: no-repeat;
// 		background-size: 100% 100%;
// 		color: #ffff;
// 		.top-title{
// 			display: block;
// 			font-size: $uni-font-size-subtitle;
// 		}
// 		.top-hover{
// 			color: $uni-text-color-grey;
			
// 		}
// 	}
	
// 	.utabbs-tabs{
// 		display: flex;
// 		height: 70rpx;
// 		line-height: 70rpx;
// 		padding: 0 10rpx;
// 		.tabs-item{
// 			flex: 1;
// 			display: inline-block;
// 			margin-right: 10rpx;
// 			text-align: center;
// 			&.active{
// 				position: relative;
// 				font-size: $uni-font-size-lg;
// 				font-weight: bold;
				
// 			}
// 		}
// 	}
// 	.utabbs-cont{
// 		.cont-item{
// 			padding: 20rpx;
// 			border-bottom: 1rpx solid $uni-bg-color-grey;
// 			.item-other{
// 				font-size: $uni-font-size-sm;
// 				color: $uni-text-color-grey;
// 				text{
// 					margin-right: 10rpx;
// 				}
// 			}
// 		}
		
// 	}
</style>
