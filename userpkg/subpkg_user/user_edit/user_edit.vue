<template>
	<view style="overflow: hidden;">
			<home-margin-bar></home-margin-bar>
		<!-- <view class="user-wrap">
			<uni-file-picker :value="filepicker" @select="selectPicker" limit="1" :del-icon="false" disable-preview :imageStyles="imageStyles"
			file-mediatype="image">选择</uni-file-picker>
		</view> -->
		
		
		<!-- <home-margin-bar></home-margin-bar> -->
		
	 
			<uni-forms ref="userform" :modelValue="user">
				<uni-forms-item class="uni-forms-item" label="姓名:">
					<uni-easyinput  :trim="true" v-model="user.name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item class="uni-forms-item" label="学号:">
					<uni-easyinput  :trim="true" v-model="user.stuid" placeholder="请输入学号" />
				</uni-forms-item>
				<uni-forms-item class="uni-forms-item" label="班级:">
					<uni-data-picker  placeholder="请选择班级" popup-title="请选择班级" :localdata="classTree" v-model="user.classid">
				</uni-data-picker>
				
				</uni-forms-item>
				<uni-forms-item class="uni-forms-item" label="性别:" >
					<uni-data-checkbox  v-model="user.sex" :localdata="sexRange" />
				</uni-forms-item>
				
				 <uni-forms-item class="uni-forms-item" label="籍贯:">
				 	<uni-easyinput :clearable="false"   @tap="openAddres" v-model="native" placeholder="请输入籍贯" />
				 </uni-forms-item>
				 <uni-forms-item class="uni-forms-item" label="住址:">
				 	<uni-easyinput v-model="user.address" placeholder="请输入籍贯" />
				 </uni-forms-item>
				 <uni-forms-item class="uni-forms-item" label="邮箱:">
				 	<uni-easyinput  v-model="user.email" placeholder="请输入邮箱" />
				 </uni-forms-item>
				 <uni-forms-item class="uni-forms-item" label="生日:">
					 <uni-datetime-picker  type="date" return-type="string" v-model="user.birthday"/>
				 </uni-forms-item>
				 
				 <button @click="editUserinfo" type="primary" style="margin: 50rpx;">完善个人信息</button>
			</uni-forms>
					    
		 <simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#007AFF'></simple-address>			
					
	
	</view>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import {groupBykey} from '@/utils/tools.js'
	export default {
		data() {
			return {
				classTree: [],
				cityPickerValueDefault: [0, 0, 1],
				sexRange: [{
					text: '男',
					value: '男'
					}, {
					text: '女',
					value:'女',
				}],
				imageStyles: {
									width: 64,
									height: 64,
									border: {
										radius: '50%'
					}
				},
				user:{
					stuid:'',
					classid:'',
					name:'',
					sex:'男',
					photo:'',
					native:[],
					address:'',
					email:'',
					birthday:'2000-1-2'
				} 
			};
		},
		computed:{
			...mapState('m_user',['token']),
			native(){
				return  this.user.native&&this.user.native.length?this.user.native.toString():''
			}
		},
		methods:{
			...mapActions('m_user',['saveUser']),
			valueChange(KEY,VALUE){
				this.user[KEY]=VALUE;
			},
			async editUserinfo(){//更改用户数据
				let params=this.user;
				let keyarr=Object.keys(params);
				params=keyarr.reduce((newdate,key)=>{
					if(params[key]&&params[key].toString().length){
						newdate[key]=params[key]
					}
					return newdate
				},{})
				params.uid=this.token.uid
				let {data}=await uni.$http.post('/api/mates/userinfo/edit',params);
				if(data.code!=200)return uni.$showMsg(data.message);
				uni.$showMsg('更改成功');
				
				this.updateState();
			},
			async getUserinfo(){
				let {data}=await uni.$http.get("/api/mates/userinfo/get?uid="+this.token.uid)
				// let {data}=await uni.$http.get('/api/mates/userinfo/get?uid='+uid)
				if(data.code!=200)return uni.$showMsg();
				if(data.data&&data.data.length){
					this.user={
						stuid:data.data[0].stuid,
						classid:data.data[0].classid,
						name:data.data[0].name,
						sex:data.data[0].sex,
						photo:data.data[0].photo,
						native:data.data[0].native,
						address:data.data[0].address,
						email:data.data[0].email,
						birthday:new Date(data.data[0].birthday).Format()
					}
				}
			},
			async getclassTree(){
				let {data}=await uni.$http.get('/api/mates/class/get');
				if(data.code!=200)return uni.$showMsg();
				let arr=groupBykey(data.data,'grade')
				this.classTree=arr;
			},
			 onConfirm(e) {
				 this.valueChange('native',e.labelArr)
			},
			openAddres() {
				if(!(this.user.native&&this.user.native.length))this.user.native=["北京市","市辖区","东城区"]
				
			    var index = this.$refs.simpleAddress.queryIndex(this.user.native, 'label');
			    this.cityPickerValueDefault = index.index;
			    this.$refs.simpleAddress.open();
			},
			async updateState(){
				let {data}=await uni.$http.get('/api/mates/userinfo/update?uid='+this.token.uid)
				if(data.code!=200)return uni.$showMsg(data.message);
				this.saveUser(data.data)
				uni.navigateBack()
			}
		},
		onLoad(){
			this.getUserinfo();
			this.getclassTree();
		}
	}
</script>

<style lang="scss">
.user-wrap{
	text-align: center;
	padding: 20rpx 0;
	&>image{
		width: 200rpx;
		height: 200rpx;
	}
}
.uni-forms-item{
	margin: 0 20rpx;
	align-items: center;
	border-bottom: 1rpx solid #f7f7f7;
	.uni-forms-item__label{
		width: 150rpx !important;
	}
	
}
.is-input-border,.uni-date-x--border,.input-value-border  {
	border: none !important;
}

@mixin flex {
	/* #ifndef APP-NVUE */
		display: flex;
	/* #endif */
		flex-direction: row;
}
	
.popup-content{
	@include flex;
	align-items: center;
	justify-content: center;
	padding: 15px;
	height: 50px;
	background-color: #fff;
}
</style>
