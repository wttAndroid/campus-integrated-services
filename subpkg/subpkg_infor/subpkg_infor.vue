<template>
	<view>
		<uni-search-bar v-model="query" @input="searchInput" placeholder="搜索资讯" @confirm="search" />
		<view class="info-list">
			<view class="info-item" @click="navigateTo(item.id)" v-for="item in infoList" :key="item.id">
				<view class="infoitem-left">
					<text class="infor-title">{{item.title}}</text>
					<view class="infoitem-bottom">
						<text v-if="item.tag>1" class="infor-tag">{{getTag(item.tag)}}</text>
						
						<text>{{item.author}}</text>
						<text class="infor-date">{{item.create_time}}</text>
					</view>
				</view>
				<view class="infoitem-right">
					<image :src="item.cover_img" mode="widthFix"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import  '@/utils/utils.js'
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				pagenum:0,
				infoList:[],
				total:0,
				timer:null,
				query:''
			};
		},
		computed:{
			getTag(){
				return function(tag){
					if(tag==1) return ''
					if(tag==2) return '热门'
					if(tag==3) return '置顶'
				}
			}
		},
		onPullDownRefresh() {
			this.init()
			if(this.query){
				this.getsearch(function(){
				uni.stopPullDownRefresh();
				uni.$showMsg("刷新成功");
			})
			}else{
				this.getinfomation(function(){
				uni.stopPullDownRefresh();
				uni.$showMsg("刷新成功");
			});
			}
		},
		methods:{
			init(){
				this.pagenum=0,
				this.infoList=[],
				this.total=0
			},
			navigateTo(id){
				uni.navigateTo({
					url:'/subpkg/subpkg_infor/infor_info/infor_info?id='+id
				})
			},
			async getinfomation(callback){//pagenum=2
				if(this.total<this.pagenum*10)return uni.$showMsg('已经加载到底部了！')
				
				this.pagenum=this.pagenum+1 //更换当前页数
				let {data}=await uni.$http.get('/api/information/getbypage?pagenum='+this.pagenum);
				if(data.code!=200)return uni.$showMsg(data.message);
				let {total,list}=data.data;
				list=list.map(item=>{
					item['cover_img']=uni.$http.baseUrl+item['cover_img'];
					item['create_time']=new Date(item['create_time']).Formatfiffer()
					return item
				})
				this.total=total;//一共多少条
				this.infoList=[...this.infoList,...list] //追加到列表中
				callback&&callback();
			},
			searchInput(e){
				this.init();
				clearTimeout(this.timer);
				this.timer=setTimeout(()=>{
					this.query=e.value;
					this.getsearch();
				},500)
			},
			async getsearch(callback){ //获取搜索
				if(this.total<this.pagenum*10)return uni.$showMsg('已经加载到底部了！')
				
				this.pagenum=this.pagenum+1 //更换当前页数
				let {data}=await uni.$http.get('/api/information/search?pagenum='+this.pagenum+"&query="+this.query);
				
				if(data.code!=200)return uni.$showMsg(data.message);
				let {total,list}=data.data;
				list=list.map(item=>{
					item['cover_img']=uni.$http.baseUrl+item['cover_img'].replace(/\\/g,'/')
					item['create_time']=new Date(item['create_time']).Formatfiffer()
					return item
				})
				this.total=total;//一共多少条
				this.infoList=[...this.infoList,...list] //追加到列表中
				callback&&callback();
			}
		},
		onLoad() {
			this.getinfomation();
		},
		onReachBottom() {
			if(this.query){
				this.getsearch()
			}else{
				this.getinfomation();
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: $uni-theme-bg-basec;
	}
.info-list{
	margin: 20rpx;
	background: #ffff;
	border-radius: $uni-border-radius-lg;
	overflow: hidden;
	.info-item{
		display: flex;
		align-items: center;
		padding: 20rpx;
		
		&:not(:last-child){
			border-bottom: 1rpx solid $uni-border-color;
		}
		.infoitem-left{
			flex: 1;
			.infor-title{
				
			}
			.infoitem-bottom{
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
				.infor-tag{
						background-color: pink;
						padding: 1rpx 5rpx;
						margin-right: 8rpx;
						color: $uni-text-color-inverse;
						border-top-left-radius: 12rpx;
						border-bottom-right-radius: 12rpx;
						font-size: $uni-font-size-sm;
					
				}
				.infor-date{
					float: right;
				}
			}
		}
		.infoitem-right{
			margin-left: 30rpx;
			width: 250rpx;
			image{
				width: 250rpx;
			}
		}
	}
	
}
</style>
