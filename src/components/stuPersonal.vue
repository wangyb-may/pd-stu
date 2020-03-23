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
			  <el-menu-item @click="itemClick('1-2')" index="1-2">密码修改</el-menu-item>
			  <el-menu-item @click="itemClick('1-3')" index="1-3">学习管理</el-menu-item>
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
					<el-form ref="form" :model="Student" label-width="80px">
					  <el-form-item label="用户名">
					    <el-input v-model="Student.nickName"></el-input>
					  </el-form-item>
					  <el-form-item label="姓名">
						<el-input v-model="Student.name"></el-input>
					  </el-form-item>
					  <el-form-item label="班级">
					  	<el-input v-model="Student.classNumber"></el-input>
					  </el-form-item>
					  <el-form-item label="年龄">
					    <el-input v-model="Student.age"></el-input>
					  </el-form-item>
					  <el-form-item label="电话">
					    <el-input v-model="Student.mobile"></el-input>
					  </el-form-item>
					  <el-form-item label="性别">
					    <el-radio-group v-model="Student.sex">
					      <el-radio label="男"></el-radio>
					      <el-radio label="女"></el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item>
					    <el-button type="primary" @click="updatePersonalInformation">更新资料</el-button>
					  </el-form-item>
					</el-form>
				</el-aside>
				<el-main>
					<!--上传头像-->
					<el-upload
					  action="http://localhost:9502/student/updatePort"
					  class="avatar-uploader"
					  :data="Student"
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
					  :before-upload="beforeAvatarUpload">
					  <img v-if="upImageUrl" :src="upImageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<div>
						点击方框上传自己的头像
					</div>
				</el-main>
			</el-container>
		</div>
		
		<div v-else-if="leftIndex==='1-2'">
			<el-form ref="passwordGroup" :model="passwordGroup" :rules="passwordRule" status-icon label-width="100px">
			  <el-form-item label="原密码" prop="oldPassword">
			    <el-input type="password" v-model="passwordGroup.oldPassword" autocomplete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="新密码" prop="newPassword">
				<el-input type="password" v-model="passwordGroup.newPassword" autocomplete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="重复新密码" prop="reNewPassword">
			  	<el-input type="password" v-model="passwordGroup.reNewPassword" autocomplete="off"></el-input>
			  </el-form-item>			 
			  <el-form-item>
			    <el-button type="primary" @click="updatePassword('passwordGroup')">修改密码</el-button>
			  </el-form-item>
			</el-form>
		</div>
		
		<div v-else-if="leftIndex==='1-3'">
			
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
			
			//更改密码输入验证规则--旧密码
			var oldPassValidate=(rule,value,callback)=>{
				if(value==""||!value){
					return callback(new Error('旧密码不能为空'));
				}else if(value!=this.Student.password){
					return callback(new Error('旧密码输入错误'));
				}else{
					callback();
				}
			};
			
			//更改密码输入验证规则--新密码
			var newPassValidate=(rule,value,callback)=>{
				if(value==""||!value){
					return callback(new Error('新密码不能为空'));
				}else if(value==this.Student.password){
					return callback(new Error('新密码不能与旧密码相同'));
				}else{
					callback();
				}
			};
			
			//更改密码输入验证规则--确认新密码
			var reNewPassValidate=(rule,value,callback)=>{
				if(value==""||!value){
					return callback(new Error('请重复输入新密码'));
				}else if(value!=this.passwordGroup.newPassword){
					return callback(new Error('请重复输入相同的新密码'));
				}else{
					callback();
				}
			};
			
			return{
				
				//学生个人信息数据集
				Student:{
					nickName:'',
					name:'',
					mobile:'',
					classNumber:'',
					age:'',
					sex:'',
					uid:'',
					password:'',
					imageUrl:''
				},
				
				//更改密码数据集
				passwordGroup:{
					oldPassword:'',
					newPassword:'',
					reNewPassword:''
				},
				
				//更改密码输入规则集
				passwordRule: {
				  oldPassword: [
					{required: true, validator:oldPassValidate, trigger: 'change' }
				  ],
				  newPassword: [
					{required: true, validator: newPassValidate, trigger: 'change' },
				  ],
				  reNewPassword: [
					{required: true, validator: reNewPassValidate, trigger: 'blur' },
				  ]
				},
				
				//左侧导航栏序号
				leftIndex:'1-1',
				
				upImageUrl:''
				
			}
		},
		
		
		
		methods:{
			//获取左边导航栏点击的栏目序号进行跳转
			itemClick(index){
				this.leftIndex=index;
				var nowPath=this.$route.path;
				if(nowPath!='/student/personal'){
					this.$router.push({
						path:'/student/personal'
					})
				}
				
			},
			
			//上传头像成功的回调方法
			handleAvatarSuccess:async function(res, file) {
				this.upImageUrl = URL.createObjectURL(file.raw);
			},
			
			//上传头像前的检测
			beforeAvatarUpload:async function(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;
				
				if (!isJPG) {
				  this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
				  this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			
			//更新个人信息
			updatePersonalInformation:function(){
				var url='http://localhost:9502/student/update';
				axios.post(url,this.Student).then(response=>{
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
			
			//更新密码后跳转登录页面
			updatePassword(formName){
				this.$refs[formName].validate((valid) => {
				  if (valid) {
					if(this.passwordGroup.oldPassword!=null &&
						this.passwordGroup.newPassword!=null &&
						this.passwordGroup.reNewPassword!=null){
							var url='http://localhost:9502/student/updatePassword';
							axios.get(url+'?uid='+this.Student.uid+'&newPassword='+this.passwordGroup.newPassword).then(response=>{
								if(response.data.status=='0'){
									this.$message({
										message: response.data.message+'请重新登录',
									    type: 'success'
									});
									this.$router.push({
										path:'/logIn',
									});
								}else{
									this.$message.error(response.data.message);
								}
							}).catch(error=>{
								this.$message.error(error.message);
							})
					}
				  } else {
					console.log('error submit!!');
					return false;
				  }
				});
			},
			
			forumItemClick(){
				this.leftIndex='';
				this.$router.push({
					path:'/student/personal/forumUser'
				})
			}
			
		},
		
		
		
		//开始时获取全局参数（用户数据集）
		created(){
			this.Student=this.$store.state.userData;
			console.log(this.Student);
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
