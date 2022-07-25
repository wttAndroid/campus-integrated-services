<template>
	<view class="container">
		<home-top-wrap v-if="resetTop"></home-top-wrap>
		
				
		<scroll-view class="top-group-wrap" scroll-x="true">
				<view class="group-item" v-for="item in groupList" :key="item.id" @click="navigateTo(item.server_path)">
					<image :src="item.icon" mode="widthFix"></image>
					<text>{{item.server_name}}</text>
				</view>
		</scroll-view>
		
		<home-choiceness></home-choiceness>
		<home-margin-bar></home-margin-bar>
		<home-information></home-information>
		<home-margin-bar></home-margin-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				groupList:[],
				resetTop:true
			}
		},
		methods: {
			navigateTo(link){
				uni.navigateTo({
					url:link,
					fail(e) {
						console.log(e)
					}
				})
			},
			async getgroupList(callback){
				let {data}=await uni.$http.get('/api/server/get');
				if(data.code!=200)return uni.$showMsg();
				this.groupList=data.data.map(item=>{
					item['icon']=uni.$http.baseUrl+'/'+item.icon_name;
					return item
				})
				callback&&callback()
			},
			onshowtop() {
				this.resetTop=false;  //刷新顶部信息
				this.$nextTick(()=>{
					this.resetTop=true;
				})
			}
		},
		onLoad() {
			this.getgroupList();
		},
		onPullDownRefresh() {
			this.onshowtop()
			this.getgroupList(function(){
				uni.stopPullDownRefresh();
			});
		}
		
	}
</script>

<style  lang="scss">
	

	.top-group-wrap{
		white-space: nowrap;
		width: 100%;
		margin-top: 150rpx;
		padding: 20rpx 0;
		font-size: $uni-font-size-sm;
		.group-item{
			display: inline-block;
			width: calc(100% / 5);
			text-align: center;
			image{
				width: 50%;
				vertical-align: middle;
			}
			text{
				display: block;
			}
		}
	}
</style>
