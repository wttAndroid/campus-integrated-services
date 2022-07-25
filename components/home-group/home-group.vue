<template>
	<view class="homegroup">
		<view class="group-item" v-for="item in groupList" :key="item.id">
			<image :src="item.icon" mode="widthFix"></image>
			<text>{{item.text}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				groupList:[
					{
						id:1,
						text:'学校概况',
						icon:'../../static/icon/学校.png',
						link:''
					},{
						id:2,
						text:'快递服务',
						icon:'../../static/icon/快递服务.png',
						link:''
					},{
						id:3,
						text:'跑步',
						icon:'../../static/icon/跑步.png',
						link:''
					},{
						id:4,
						text:'其他',
						icon:'../../static/icon/其他.png',
						link:''
					},{
						id:5,
						text:'全部',
						icon:'../../static/icon/全部.png',
						link:''
					}
				]
			};
		}
	}
</script>

<style lang="scss">
.homegroup{
	padding: 16rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	.group-item{
		flex: 0 0 18%;
		text-align: center;
		image{
			width: 65%;
		}
		text{
			display: block;
		}
	}
}
</style>
