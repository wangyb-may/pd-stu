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
		<div v-for="post in dealPosts">
		<el-row type="flex" class="row-bg" justify="center" >
		  <el-col :span="15">
		  	<el-card shadow="hover">	
		  	  <el-row>
				  <el-col :span="15"><el-link href="" target="_blank" :underline="false"><h3>{{post.title}}</h3></el-link></el-col>
			  </el-row>
			  
			  <el-row>
				  <el-col :span="4"><el-image style="width: 100px; height: 100px" :src="circleUrl" fit="cover"></el-image></el-col>
				  <el-col :span="15">{{post.content}}</el-col>
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
			
			forumName:'',
			
			circleUrl:'http://wyb-bysj.oss-cn-chengdu.aliyuncs.com/image/456.jpg?Expires=1586684889&OSSAccessKeyId=LTAI4FqEfb86cMQiGtcEtxPn&Signature=iVLRCcpE7Wfca0Iy6wncFO%2FpEGc%3D'
			
			
		}
	},
	
	methods:{
		//第一次登录论坛完善个人信息
		updateForumName(){
			axios.get('http://localhost:9502/student/updateForumName',{params:{
				uid:this.uid,
				forumName:this.forumName,
				}
			}).then(response=>{
				if(response.data.status=='0'){	
					this.$message({
					          message: response.data.message,
					          type: 'success'
					});
					this.Student.forumName=this.forumName;
					this.$store.commit('setUserData',this.Student);
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
