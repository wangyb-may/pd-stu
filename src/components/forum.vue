<template>
	<div v-if="forumName===null">
		请先设置一个论坛昵称，论坛将不会使用你的真实姓名
		<el-form ref="form"  label-width="80px">
		  <el-row :gutter="20">
			  <el-col :span="12">
				  <el-form-item label="论坛昵称">
					<el-input v-model="forumName"></el-input>
				  </el-form-item>
			  </el-col>
			  <el-col :span="6">
				  <el-form-item>
					<el-button type="primary" @click="updateForumName">使用昵称</el-button>
				  </el-form-item>
			  </el-col>
		  </el-row>
		</el-form>
	</div>
	
	<div v-else>
		<div v-if="isShowPost==true">
			<el-page-header @back="goBack" content="帖子详情"></el-page-header>
			<h2 >{{nowPost.title}}</h2>
			<span>发布时间:{{nowPost.createTime}} &nbsp;  发布人:{{nowPost.createUser}} </span>
			<el-divider></el-divider>
			<div v-html="nowPost.content"></div>
			
			<el-divider>下面是别人的回复，看看吧！</el-divider>
			<div v-for="re in replyList">
				{{re.respondentName}}：{{re.content}}
			</div>
			<el-divider></el-divider>
			<span>说点什么再走吧！</span>
			<br>
			<el-input type="textarea" v-model="reply" style="width: 40%;"></el-input>
			<el-button type="primary" @click="haveReply" style="width: 100px;">发表评论</el-button>
		</div>
		
		<div v-if="isShowPost==false">
			<div v-for="post in dealPosts">
			<el-row type="flex" class="row-bg" justify="center" >
			  <el-col :span="15">
			  	<el-card shadow="hover">	
			  	  <el-row>
					  <el-col :span="15"><el-link  target="_blank" :underline="false" @click="showDetail(post)"><h3>{{post.title}}</h3></el-link></el-col>
				  </el-row>
				  <el-row>
					  <el-col :span="4"><el-image style="width: 100px; height: 100px" :src="circleUrl" fit="cover"></el-image></el-col>
					  <el-col :span="15"><div v-html="post.content"></div></el-col>
					  <el-col :span="5">
						  <el-row>
							  <el-col :span="20"><i class="el-icon-user">{{post.createUser}}</i></el-col>
						  </el-row>
						  <el-row>
						  	  <el-col :span="40"><i class="el-icon-time">{{post.createTime}}</i></el-col>
						  </el-row>
						  <el-row>
						  	  <el-col :span="40"><i class="el-icon-menu">{{post.postType}}</i></el-col>
						  </el-row>
					  </el-col>
				  </el-row>
			  	</el-card>
			  </el-col>
			</el-row>
			</div>
			
			
		</div>
		
		
	</div>
</template>

<script>
	import axios from 'axios'
	import Vuex from 'vuex'
export default{
	data(){
		return {
			
			Student:'',
			
			rawPosts:[],
			dealPosts:[],
			nowPost:'',
			reply:'',
			replyList:[],
			
			forumName:'',
			isShowPost:false,
			
			circleUrl:'https://wyb-bysj.oss-cn-chengdu.aliyuncs.com/image/456.jpg?Expires=1589112302&OSSAccessKeyId=TMP.3Kg3Y23MKwdamTKREPUPUtLRzf6gnvv5YN8MKtzdVTKy4eqD1cSSPcgogjM4BkTywodHRHWR6PKJ2WQXM2r7zuixoBedxR&Signature=QKgjzpYVTYKSS9h3IxPRoygxOJE%3D'
			
			
		}
	},
	
	methods:{
		//第一次登录论坛完善个人信息
		updateForumName(){
			//测试注释
			var url=this.$route.path.split('/');
			
			var tableName='pd_'+url[1];
			axios.get('http://localhost:9505/post/updateForumName',{params:{
				uid:this.uid,
				forumName:this.forumName,
				table:tableName
				}
			}).then(response=>{
				if(response.data.status=='0'){	
					this.$message({
					          message: response.data.message,
					          type: 'success'
					});
					this.student.forumName=this.forumName;
					this.$store.commit('setUserData',this.student);
				}
				else{
					this.$message.error(response.data.message);
				}
			}).catch(error=>{
				this.$message.error(error.message);
			})
		},
		
		//获取帖子数据
		findPostList(){
			axios.post("http://localhost:9505/post/list").then(res=>{
				this.rawPosts=res.data.data;
				console.log(this.rawPosts);
				this.dealPosts=this.dealPostsData(this.rawPosts);
			}).catch(error=>{
				this.$message.error(error.message);
			})
		},
		
		//帖子数据处理
		dealPostsData(posts){
			for(var i=0;i<posts.length;i++){
				if(posts[i].postType==1){
					posts[i].postType="灌水帖";
				}else{
					posts[i].postType="学术贴";
				}
				
				if(posts[i].content.length>=40){
					posts[i].content=posts[i].content.slice(0,40)+"...";
				}
			}
			return posts;
		},
		
		showDetail(post){
			this.isShowPost=true;
			axios.post("http://localhost:9505/post/list").then(res=>{
				var data=res.data.data;
				for(var i=0;i<data.length;i++){
					if(post.pid==data[i].pid){
						this.nowPost=data[i];
					}
				}
				this.findReply();
			}).catch(error=>{
				this.$message.error(error.message);
			})
		},
		
		findReply(){
			var data={
				postId:this.nowPost.pid
			}
			axios.post('http://localhost:9505/post/findReply',data).then(response=>{
				if(response.data.status=='0'){
					this.replyList=response.data.data;
				}
			}).catch(error=>{
				this.$message.error(error.message);
			})
		},
		
		haveReply(){
			var data={
				postId:this.nowPost.pid,
				parentId:this.nowPost.pid,
				content:this.reply,
				respondentName:this.forumName
			}
			axios.post('http://localhost:9505/post/addReply',data).then(response=>{
				if(response.data.status=='0'){
					this.$message.success('回复成功！');
					this.findReply();
				}
			}).catch(error=>{
				this.$message.error(error.message);
			})
		},
		
		
		
		goBack() {
			this.isShowPost=false;
		}
		
	},
	
	created() {
		this.Student=this.$store.state.userData;
		this.forumName=this.Student.forumName;
		this.findPostList();
	}
}
</script>

<style>
	.card {
	    -webkit-border-radius: 5px;
	    border-radius: 5px;
	    margin: 180px auto;
	    width: 350px;
	    padding: 35px 35px 15px;
	    background: #fff;
	    border: 1px solid #eaeaea;
	    box-shadow: 0 0 25px #cac6c6;
	}
</style>
