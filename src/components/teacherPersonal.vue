<template>
	<el-container>
	  <el-aside width="200px">
		<el-menu
		  default-active="1-1"
		  class="el-menu-vertical-demo">
		  <el-submenu index="1">
			<template slot="title">
			  <i class="el-icon-setting"></i>
			  <span>个人管理</span>
			</template>
			<el-menu-item-group>
			  <el-menu-item @click="itemClick('1-1')" index="1-1">个人基础信息设置</el-menu-item>
			</el-menu-item-group>
		  </el-submenu>
		  <el-submenu index="2">
			 <template slot="title">
				<i class="el-icon-menu"></i>
				<span slot="title">论坛管理</span>
			</template>
			<el-menu-item-group>
			  <el-menu-item @click="forumItemClick" index="2-1">论坛设置</el-menu-item>
			</el-menu-item-group>
		  </el-submenu>
		</el-menu>
	</el-aside>
	
	  <el-main>
		<div v-if="leftIndex==='1-1'">
			<el-container>
				<el-aside width="600px">
					<!--更新个人资料-->
					<el-form ref="form" :model="teacher" label-width="80px">
					  <el-form-item label="用户名">
					    <el-input v-model="teacher.uid" :disabled="true"></el-input>
					  </el-form-item>
					  <el-form-item label="姓名">
						<el-input v-model="teacher.name"></el-input>
					  </el-form-item>
					  <el-form-item label="电话">
					    <el-input v-model="teacher.phone"></el-input>
					  </el-form-item>
					  <el-form-item label="性别">
					    <el-radio-group v-model="teacher.sex">
					      <el-radio label="男"></el-radio>
					      <el-radio label="女"></el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item>
					    <el-button type="primary" @click="updatePersonalInformation">更新资料</el-button>
					  </el-form-item>
					</el-form>
				</el-aside>
				
			</el-container>
		</div>
		
		
		
		
		<router-view></router-view>
	  </el-main>
	</el-container>
</template>

<script>
	import Vuex from 'vuex'
	import axios from 'axios'
	export default{
		data(){

			
			return{
				//教师个人信息
				teacher:{},
				
				
				
				
				
				//左侧导航栏序号
				leftIndex:'1-1',
				
				upImageUrl:'',
				
				myCourseList:'',
				delStatus:'',
				delMessage:''
				
			}
		},
		
		
		
		methods:{
			//获取左边导航栏点击的栏目序号进行跳转
			itemClick(index){
				this.leftIndex=index;
				var nowPath=this.$route.path;
				if(nowPath!='/teacher/personal'){
					this.$router.push({
						path:'/teacher/personal'
					})
				}
				
			},
			
			
			
			
			
			//更新个人信息
			updatePersonalInformation:function(){
				var url='http://localhost:9501/teacher/update';
				axios.post(url,this.teacher).then(response=>{
					if(response.data.status=="0"){
						this.$store.commit('setUserData',response.data.data);
						this.$message({
						          message: response.data.message,
						          type: 'success'
						});
					}else{
						this.$message.error(response.data.message);
					}
					
				}).catch(error=>{
					this.$message.error(error.message);
				});
			},
			
			
			
			forumItemClick(){
				this.leftIndex='';
				this.$router.push({
					path:'/teacher/forumUser'
				})
			},
			
			
			
			
			
		},
		
		
		
		//开始时获取全局参数（用户数据集）
		created(){
			this.teacher=this.$store.state.userData;
			console.log(this.teacher);
		}
	}
</script>

<style>
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	  .avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	  }
	  .avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	  }
</style>
