<template>
	<div class="login-container" v-if="isStu==0">
	        <el-form :model="ruleForm" :rules="rules"
	         status-icon
	         ref="ruleForm" 
	         label-position="left" 
	         label-width="0px" 
	         class="demo-ruleForm login-page">
	            <h3 class="title">Python课程辅助学习系统-学生</h3>
	            <el-form-item prop="nickName">
	                <el-input type="text" 
	                    v-model="ruleForm.nickName" 
	                    auto-complete="off" 
	                    placeholder="用户名"
	                ></el-input>
	            </el-form-item>
	                <el-form-item prop="password">
	                    <el-input type="password" 
	                        v-model="ruleForm.password" 
	                        auto-complete="off" 
	                        placeholder="密码"
	                    ></el-input>
	                </el-form-item>
	            <el-checkbox 
	                v-model="checked"
	                class="rememberme"
	            >记住密码</el-checkbox>
	            <el-form-item style="width:100%;">
	                <el-button type="primary" style="width:100%;" @click="handleSubmit" >登录</el-button>
					<el-button type="text" @click="changeOther(1)">切换到教师登录</el-button>
	            </el-form-item>
				
	        </el-form>
			
	    </div>
		
		<div class="login-container" v-else-if="isStu==1">
		        <el-form :model="ruleForm" :rules="rules"
		         status-icon
		         ref="ruleForm" 
		         label-position="left" 
		         label-width="0px" 
		         class="demo-ruleForm login-page">
		            <h3 class="title">Python课程辅助学习系统-教师</h3>
		            <el-form-item prop="nickName">
		                <el-input type="text" 
		                    v-model="ruleForm.nickName" 
		                    auto-complete="off" 
		                    placeholder="用户名"
		                ></el-input>
		            </el-form-item>
		                <el-form-item prop="password">
		                    <el-input type="password" 
		                        v-model="ruleForm.password" 
		                        auto-complete="off" 
		                        placeholder="密码"
		                    ></el-input>
		                </el-form-item>
		            
		            <el-form-item style="width:100%;">
		                <el-button type="primary" style="width:100%;" @click="handleSubmit" >登录</el-button>
						<el-button type="text" @click="changeOther(0)">切换到学生登录</el-button>
		            </el-form-item>
		        </el-form>
		    </div>
</template>

<script>
	import axios from 'axios'
	
	export default{
		
		data(){
		        return {
		            logining: false,
		            ruleForm: {
		                nickName: '',
		                password: '',
		            },
		            rules: {
		                nickName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
		                password: [{required: true, message: '请输入密码', trigger: 'blur'}]
		            },
		            checked: false,
					isStu:0
		        }
		    },
		    methods: {
		        handleSubmit(event){
		            this.$refs.ruleForm.validate((valid) => {
		                if(valid){
		                    this.logining = true;
							var url;
							var rowPath;
							if(this.isStu==0){
								url='http://localhost:9502/student/login';
								rowPath='/student'
							}else{
								url='http://localhost:9501/teacher/login'
								rowPath='teacher'
							}
		                    axios.post(url,this.ruleForm).then(
		                    	response=>{
		                    		if(response.data.status==="0"){
										this.$store.commit('setUserData',response.data.data);
										console.log(response.data.data);
										if(this.isStu==0){
											this.$router.push({
												path:rowPath,
												query: {
												    uid: response.data.data.uid,
												    name: response.data.data.name,
												  }
											})
										}else{
											this.$router.push({
												name:rowPath,
												params: {
												    uid: response.data.data.uid,
												    name: response.data.data.name,
												  }
											})
										}
		                    			
		                    		}
		                    		else{
		                    			alert(response.data.message);
		                    		}
		                    		
		                    	}
		                    ).catch(error=>{
		                    	console.log(error.message)
		                    })
		                }else{
		                    console.log('error submit!');
		                    return false;
		                }
		            })
		        },
				
				changeOther(temp){
					this.isStu=temp;
				}
		    }
	}
</script>

<style>
	.login-container {
	    width: 100%;
	    height: 100%;
	}
	.login-page {
	    -webkit-border-radius: 5px;
	    border-radius: 5px;
	    margin: 180px auto;
	    width: 350px;
	    padding: 35px 35px 15px;
	    background: #fff;
	    border: 1px solid #eaeaea;
	    box-shadow: 0 0 25px #cac6c6;
	}
	label.el-checkbox.rememberme {
	    margin: 0px 0px 15px;
	    text-align: left;
	}
</style>
