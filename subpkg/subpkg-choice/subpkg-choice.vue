<template>
	<view style="height: 100%;">
		<view class="choice-top">
			<uni-search-bar  v-model="searchValue" @input="inputEvent" @cancel="cancelEvent">
			</uni-search-bar>
		</view>
		<view class="choice-wrap">
			<scroll-view class="scroll-wrap left" scroll-y="true">
				<view v-for="item in cateList" :key="item.id" :class="['scroll-item',item.id==active?'active':'']" @click="setActive(item.id)">{{item.name}}</view>
			</scroll-view>
			<scroll-view class="scroll-wrap right" scroll-y="true">
				<view class="scroll-item" v-for="item in articleList" :key="item.id" @click="navigateTo(item.id)">
					<image :src="item.cover_img" ></image>
					<view class="choice-item-right">
						<text class="right-title">{{item.title}}</text>
						<view class="right-other">
							<text><text class="tag">{{item.readq}}</text>阅读 </text>
							<text><text class="tag">{{item.followq}}</text>人参与</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<uni-fab ref="fab"  :content="content" horizontal="right" vertical="bottom" direction="vertical" @trigger="trigger"/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchValue:'',
				active:0,
				cateList:[],
				articleList:[],
				total:0,
				pagenum:0,
				content: [{
						iconPath: '/static/icon/fabu.png',
						text: '发布',
						link:'/subpkg/subpkg-choice/choice_info/choice_add'
					}
				]
			};
		},
		methods:{
			trigger(e){
					uni.navigateTo({url:this.content[e.index].link})
			},
			cancelEvent(){
				this.getCateList();
			},
			async inputEvent(e){
				this.active=-1;
				let {data}=await uni.$http.get('/api/article/ls/search?query='+e.value);
				if(data.code!=200)return uni.$showMsg();
				let {total,list}=data.data;
				this.articleList=list.map(item=>{
					item.cover_img=uni.$http.baseUrl+item.cover_img;
					return item;
				})
				this.total=total;//一共多少条
			},
			setActive(index){
				this.active=index;
				this.getArticleLs(index);
			},
			navigateTo(id){
				uni.navigateTo({
					url:'/subpkg/subpkg-choice/choice_info/choice_info?id='+id
				})
			},
			async getCateList(){
				let {data}=await uni.$http.get('/api/article/cate/get')
				if(data.code!=200) return uni.$showMsg();
				this.cateList=data.data;
				if(this.cateList){
					this.setActive(this.cateList[0].id)
				}
			},
			async getArticleLs(cid){
				let {data}=await uni.$http.get('/api/article/ls/get?cid='+cid);
				if(data.code!=200)return uni.$showMsg();
				this.articleList=data.data.map(item=>{
					item.cover_img=uni.$http.baseUrl+item.cover_img;
					return item;
				})
			},
			async scrolltolowerEvent(){
				if(this.total<this.pagenum*10)return uni.$showMsg('已经加载到底部了！');
				this.pagenum=this.pagenum+1 //更换当前页数
				let {data}=await uni.$http.get('/api/article/ls/search?query='+this.searchValue+'&pagenum='+this.pagenum);
				if(data.code!=200)return uni.$showMsg();
				let {total,list}=data.data;
				let list2=list.map(item=>{
					item.cover_img=uni.$http.baseUrl+item.cover_img;
					return item;
				})
				
				this.articleList=[...this.articleList,...list2]
				this.total=total;//一共多少条
			}
		},
		onLoad() {
			this.getCateList();
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.choice-top{
		height: 100rpx;
	}
	.choice-wrap{
		display: flex;
		height: calc(100% - 100rpx);
		color: $uni-text-color;
		.scroll-wrap{
			&.left{
				width: 150rpx;
				text-align: center;
				.scroll-item{
					height: 100rpx;
					line-height: 100rpx;
					overflow: hidden;
					&.active{
						color: $uni-them-font-color;
						background-color: $uni-theme-bg-basec;
					}
				}
			}
			&.right{
				flex: 1;
				box-sizing: border-box;
				background-color: $uni-theme-bg-basec;
				overflow: hidden;
				.scroll-item{
					display: flex;
					align-items: center;
					margin: 20rpx;
					padding: 20rpx;
					background-color: $uni-bg-color;
					border-radius: 20rpx;
					&>image{
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
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
				}
			}
			.scroll-item{
				
			}
		}
	}
	// .selectModle{
	// 	    position: fixed;
	// 	    bottom: -100%;
	// 	    background-color: #f3f3f3;
	// 	    left: 0;
	// 	    right: 0;
	// 	    height: 60%;
	// 	    z-index: 1;
	// 	    overflow: auto;
	// 	    transition: bottom .5s ease;
	// 	    border-top-left-radius: 50rpx;
	// 	    border-top-right-radius: 50rpx;
	// 	    padding: 80rpx 30rpx 30rpx;
	// 		.model-button{
	// 			position: absolute;
	// 			right: 30rpx;
	// 			top: 20rpx;
	// 		}
	// 	&.show{
	// 	  bottom: 0;
	// 	}
	// }
	// .choice-top{
	// 	padding: 80rpx 0;
	// 	text-align: center;
	// 	    background: #4cd7e0;
	// 	    color: #ffff;
	// 	.top-title{
	// 		display: block;
	// 		font-size: $uni-font-size-subtitle;
	// 	}
	// 	.top-hover{
	// 		color: $uni-text-color-grey;
			
	// 	}
	// }
	// .choice-list{
	// 	.choice-item{
	// 		padding: 20rpx;
	// 		display: flex;
	// 		image{
	// 			flex: 0 0 100rpx;
	// 			height: 100rpx;
	// 			position: relative;
	// 			margin-top: 15rpx;
	// 		}
	// 		&:nth-child(1){
	// 			&>image{
	// 				&::after{
	// 					content: '1';
	// 					position: absolute;
	// 					left: 0rpx;
	// 					top: 0rpx;
	// 					background-color: #f44336;
	// 					width: 30rpx;
	// 					height: 30rpx;
	// 					text-align: center;
	// 					line-height: 30rpx;
	// 					border-bottom-right-radius: 50%;
	// 				}
	// 			}
	// 		}
	// 		&:nth-child(2){
	// 			&>image{
	// 				&::after{
	// 					content: '2';
	// 					position: absolute;
	// 					left: 0rpx;
	// 					top: 0rpx;
	// 					background-color: #FF9800;
	// 					width: 30rpx;
	// 					height: 30rpx;
	// 					text-align: center;
	// 					line-height: 30rpx;
	// 					border-bottom-right-radius: 50%;
	// 				}
	// 			}
	// 		}
	// 		&:nth-child(3){
	// 			&>image{
	// 				&::after{
	// 					content: '3';
	// 					position: absolute;
	// 					left: 0rpx;
	// 					top: 0rpx;
	// 					background-color: #fff27c;
	// 					width: 30rpx;
	// 					height: 30rpx;
	// 					text-align: center;
	// 					line-height: 30rpx;
	// 					border-bottom-right-radius: 50%;
	// 				}
	// 			}
	// 		}
			
	// 		.choice-item-right{
	// 			flex: 1;
	// 			min-width: 0;
	// 			margin-left: 20rpx;
	// 			border-bottom: 1rpx solid $uni-border-color;
	// 			.right-title{
	// 					white-space: nowrap;
	// 				    overflow: hidden;
	// 				    text-overflow: ellipsis;
	// 				    display: block;
	// 			}
	// 			.right-hover{
	// 				white-space: nowrap;
	// 				overflow: hidden;
	// 				text-overflow: ellipsis;
	// 				display: block;
	// 				font-size: $uni-font-size-sm;
	// 				color: $uni-text-color-grey;
	// 			}
	// 			.right-other{
	// 				color: $uni-text-color-grey;
	// 				font-size: $uni-font-size-ssm;
	// 			}
	// 		}
	// 	}
	// }
	// .tag-view{
	// 	.tag{
	// 		    width: 150rpx;
	// 		    display: inline-block;
	// 		    margin: 10rpx;
	// 	}
	// }
</style>
