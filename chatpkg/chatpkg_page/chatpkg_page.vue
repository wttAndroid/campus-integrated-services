<template>
	<view style="height: 100%;">
		<scroll-view  id="scrollview" style="height:calc(100% - 100rpx);" :scroll-top="scrollTop"  scroll-y="true" >
			<view class="chat-wrap" id="msglistview">
				<view class="message-item" v-for="item in messagelist" :key="item.id" :class="item.from_id==token.uid?'my':''">
					<image v-if="item.from_id==id" class="address" :src="userpick(0)" mode="widthFix"></image>
					<view class="content">
						<text v-if="item.ctype==0">{{item.content}}</text>
						<view style="min-width: 200rpx;" v-else-if="item.ctype==1" @click="play(item.content)">
							点击聆听
							<view class="iconfont icon-icon_laba_2" style="transform: rotateY(180deg); float: right;"></view>
						</view>
					</view>
					<image v-if="item.from_id==token.uid" class="address" :src="userpick(1)" mode="widthFix"></image>
				</view>
			</view>
		</scroll-view>
		<view class="chat-input-wrap">
			<view class="input-text-wrap">
				<view class="iconfont icon-a-icon_maikefengluyin" @click="isspeak=!isspeak"></view>
				<view class="button-wrap">
					<button :class="['speakbutton',activeSpeak?'active':'']" @longtap="longtapEvent" @touchend="touchendEvent" v-show="isspeak" type="default">按住说话</button>
					<input  v-show="!isspeak" :cursor="cursornum" @blur="blurEvent" v-model="text" type="text" value="" />
				</view>
				<span v-show="!isspeak" class="but-emoji" @click="showemoji=!showemoji">😀</span>
				<button v-show="!isspeak" size="mini" @click="sendClick" type="primary">发送</button>
			</view>
			<view class="input-other-wrap" v-show="showemoji">
				<swiper class="slider" >
				    <swiper-item v-for="(item, key) in emojiData" :key="key" class="slider-emoji" :class="[key==emojiData.length-1?'lastbox':'']">
				        <text v-for="(emoji, index) in item" :key="index" @click="selemoji(emoji)" class="slider-emoji-icon">{{ emoji }}</text>
				    </swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import emoji from '@/static/emoji'
	import {mapState,mapActions} from 'vuex';
	
	const recorderManager = uni.getRecorderManager(); //创建一个监听
	const innerAudioContext = uni.createInnerAudioContext(); //创建一个播放
	
	export default {
		data() {
			return {
				emojiData:[],
				showemoji:false,
				cursornum:0,
				text:"",
				id:null,
				messagelist:[],
				scrollTop:0,
				isspeak:false,
				activeSpeak:false
			};
		},
		computed:{
			...mapState('m_user',['token']),
			...mapState('m_chat',['chatlist']),
			userpick(){
				return (tag)=>{
					if(tag)return uni.$http.baseUrl+(this.chatlist.users[this.token.uid]&&this.chatlist.users[this.token.uid].user_pic)
					// if(tag)return "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png"
					if(!tag)return uni.$http.baseUrl+(this.chatlist.users[this.id]&&this.chatlist.users[this.id].user_pic)
				}
			}
		},
		watch:{
			chatlist(){
				console.log("--触发了更新数据--")
				this.getchatPage()
			}
		},
		mounted() {
			this.scrollToBottom()
		},
		onUnload(){
			this.getchatlist(this.token.uid)
		},
		methods:{
			...mapActions('m_chat',['sendMsg','getchatlist']),
			scrollToBottom(){
				let that=this;
				let query=uni.createSelectorQuery();
				query.select('#scrollview').boundingClientRect();
				query.select('#msglistview').boundingClientRect();
				query.exec((res)=>{
					if(res[1].height > res[0].height){
					    that.scrollTop = res[1].height - res[0].height
					 }
				})
			},
			async readClick(uid,fromid){
				let {data}=await uni.$http.post("/api/chat/read",{uid,from:fromid});
				if(data.code!=200)console.log("--读取了该消息--");
			},
			async sendClick(){
				this.showemoji=false;
				if(!this.text)return uni.$showMsg('请先输入您要发送的内容');
				if(!this.token.uid)return uni.$showMsg('请先登录');
				this.sendMsg({msg:this.text,from:this.token.uid,to:this.id})
				uni.$showMsg('发送成功');
				this.text=''
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
			},
			async getchatPage(){
				let that=this;
				let chatid=[this.token.uid,this.id].sort().join("_")
				if(that.chatlist&&that.chatlist.chat){
					let arr=that.chatlist.chat.filter(item=>{
						return item.chat_id==chatid;
					})
					
					that.messagelist=arr.sort((a,b)=>{
						let aa=new Date(a['create_time'])
						let bb=new Date(b['create_time'])
						return aa-bb;
					})
					
					await that.readClick(that.token.uid,that.id)
					this.scrollToBottom()
				}
			},
			longtapEvent(){
				this.activeSpeak=true;
				recorderManager.start()
			},
			touchendEvent(){
				this.activeSpeak=false
				recorderManager.stop()
			},
			initSpeak(){
				let that=this;
				recorderManager.onStop(function(res){
					console.log('recorder stop' + JSON.stringify(res));
					that.sendVoice(res.tempFilePath)
				})
			},
			play(voicePath){
				if (voicePath) {
					innerAudioContext.src = uni.$http.baseUrl+voicePath.replace(/\\/,"/");
					innerAudioContext.play();
				}
			},
			async sendVoice(voicePath){
				console.log(voicePath);
				if(!voicePath)return uni.$showMsg('请先录制您的语音消息');
				this.updatePicker(voicePath);	
			},
			updatePicker(tempFilePath){
				let that=this;
				if(!that.token.uid)return uni.$showMsg('请先登录');
				uni.uploadFile({
					url:uni.$http.baseUrl+'/api/file/upload',
					filePath:tempFilePath,
					name:'file',
					header:{
						Authorization:that.token.tokenn,
						"Content-Type":"multipart/form-date"
					},
					success:(res)=>{
						let datas=JSON.parse(res.data)
						if(datas.code==200){
							console.log(res,'上传成功');
							that.sendMsg({msg:datas.data.filepath,from:that.token.uid,to:that.id,ctype:1})
							uni.$showMsg('发送成功');
						}else{
							console.log('上传失败')
						}
					}
				})
			},
		},
		onLoad(options) {
			this.initemoji()
			this.id=options.id;
			this.getchatPage();
			this.initSpeak()
			// uni.pageScrollTo({scrollTop: 99999, duration: 0});
		}
	}
</script>

<style lang="scss">
	page{
		background: aliceblue;
		height: 100%;
	}
.chat-wrap{
	.message-item{
		text-align: left;
		margin: 30rpx 0;
		.address{
			width: 70rpx;
			margin: 0rpx 10rpx;
		}
		.content{
			max-width: 60%;
			min-height: 70rpx;
			vertical-align: top;
			box-sizing: border-box;
			padding:10rpx 20rpx;
			text-align: start;
			align-items: center;
			display: inline-block;
			background-color: white;
			border-radius: 10rpx;
			overflow-wrap: break-word;
		}
		&.my{
			text-align: right;
			.content{
				background-color: #b2e281;
			}
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

.lastbox{
    justify-content: flex-start;
}

.speakbutton{
	position: relative;
	&.active{
		&::after{
			position: absolute;
			top: 0;
			content:'';
			display: block;
			height: 2px;
			background-color: rgb(0, 255, 76);
			margin-left: 50%;
			transform: translateX(-50%);
			transition: width 5s ease;
			animation: go 2s ease-in-out 0s infinite;
		}
	}
}

  @keyframes go {
      0% {
        width: 20%;
      }

      50% {
        width: 100%;
      }

      100% {
        width: 20%;
      }
    }
</style>
