<template>
	<el-container>
	  <el-header> 
		  <el-menu
		    :default-active="this.$route.path"
		    class="el-menu-demo"
		    mode="horizontal"
		    @select="handMenuSelect"
		    background-color="#545c64"
		    text-color="#fff"
		    active-text-color="#409EFF">
			
		    <el-menu-item index="1">学生账号管理</el-menu-item>
		    <el-menu-item index="2">教师账号管理</el-menu-item>
			<el-submenu index="4" style="justify-content: flex-end;">
				<template slot="title">
					{{name}}
				</template>
			</el-submenu>
		  </el-menu>
	  </el-header>
	  <el-container>
	    
	    <el-main>
			<el-container v-if="index=='1'">
				<el-header>
					<el-row>
						<el-col :span="3"><el-button type="primary" @click="downLoadModel()">下载学生账号模板</el-button></el-col>
					  <el-col :span="3">
						  <el-upload
						    class="upload-demo"
						    action="http://localhost:9503/admin/createNewStudent"
						    :on-success="upSuccess"
						    multiple
						    :limit="1">
						    <el-button
						  	type="primary" 
						    >批量导入学生账号</el-button>
						  </el-upload>
						  </el-col>
					  
					  <el-col :span="15">
						  <el-input
						  style="width: 300px;"
							placeholder="搜索学生、学号(与班级无关)"
							v-model="keyword"
							clearable>
						  </el-input>
						  <el-button type="primary" icon="el-icon-search" @click="findStudentByKey"></el-button>
					  </el-col>
					  
					  <el-col :span="6">
						 <span>选择班级</span>
						<el-select v-model="classNumber" placeholder="请选择" @change="findUser()">
						  <el-option
							v-for="item in classNumberList"
							:key="item.classNumber"
							:label="item.classNumber"
							:value="item.classNumber"
							>
						  </el-option>
						</el-select>
					  </el-col>
					</el-row>
				</el-header>
				
				<el-table
				    :data="student"
				    stripe
				    style="width: 100%">
				    <el-table-column
				      prop="nickName"
				      label="学号">
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      label="姓名">
				    </el-table-column>
				    <el-table-column
				      prop="sex"
				      label="性别">
				    </el-table-column>
					<el-table-column
					  prop="classNumber"
					  label="班级">
					</el-table-column>
					<el-table-column
					  prop="mobile"
					  label="电话">
					</el-table-column>
					<el-table-column label="状态" prop="isDelete"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click="delUser(scope.row,'pd_student')">停用</el-button>
							<el-button type="text">启用</el-button>
						</template>
					</el-table-column>
				  </el-table>
			</el-container>
			
			<el-container v-if="index=='2'">
				<el-button type="primary" @click="teacherOpenWall()" style="width: 200px;">添加新的教师账号</el-button>
				<el-drawer
				  title="添加新作业"
				  :visible.sync="teacherDialog"
				  direction="ltr"
				  custom-class="demo-drawer"
				  ref="drawer"
				  >
				  <div class="demo-drawer__content">
				    <el-form :model="newTeacher" :rules="rules" ref="ruleForm">
				      <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
				        <el-input v-model="newTeacher.name" autocomplete="off"></el-input>
				      </el-form-item>
						<el-form-item label="电话" :label-width="formLabelWidth">
						  <el-input  v-model="newTeacher.phone" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="密码" :label-width="formLabelWidth" prop="password">
						  <el-input v-model="newTeacher.password" autocomplete="off"></el-input>
						</el-form-item>
				      <el-form-item label="性别" :label-width="formLabelWidth">
				        <el-radio-group v-model="newTeacher.sex">
				              <el-radio label="男"></el-radio>
				              <el-radio label="女"></el-radio>
				            </el-radio-group>
						</el-form-item>
				    </el-form>
				    <div class="demo-drawer__footer">
				      <el-button @click="cancelForm">取 消</el-button>
				      <el-button type="primary" @click="createNewTeacher()" >确定</el-button>
				    </div>
				  </div>
				</el-drawer>
				
				
				
				
				<el-table
				    :data="teacher"
				    stripe
				    style="width: 100%">
				    <el-table-column
				      prop="uid"
				      label="账号">
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      label="姓名">
				    </el-table-column>
				    <el-table-column
				      prop="sex"
				      label="性别">
				    </el-table-column>
					<el-table-column
					  prop="phone"
					  label="电话">
					</el-table-column>
					<el-table-column label="状态" prop="del"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click="delUser(scope.row,'pd_teacher')">停用</el-button>
							<el-button type="text">启用</el-button>
						</template>
					</el-table-column>
				  </el-table>
			</el-container>
			
		</el-main>
	  </el-container>
	</el-container>
	
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return {
				index:'1',
				
				uid:'',
				name:'',
				
				student:[],
				teacher:[],
				classNumberList:'',
				classNumber:'',
				keyword:'',
				newTeacher:{
					name:'',
					phone:'',
					sex:'',
					password:''
				},
				formLabelWidth: '80px',
				timer:null,
				rules:{
					name:[
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					password:[
						{ required: true, message: '请输入密码', trigger: 'blur' }
					]
				},
				
				teacherDialog:false,
				
			}
		},
		
		
		methods:{
			handMenuSelect(key,keyPath){
				this.index=key;
			},
			
			
			teacherOpenWall(){
				this.teacherDialog=true;
			},
			
			cancelForm() {
			  this.teacherDialog = false;
			  clearTimeout(this.timer);
			},
			
			//上传成功回调
			upSuccess(response){
				if(response.status=='0'){
					this.$message.success(response.message);
				}else{
					this.$message.error(response.message);
				}
				
				
			},
			
			//查询班级
			findClassNumber(){
				var url="http://localhost:9503/admin/class";
				var data={};
				axios.post(url).then(response=>{
					if(response.data.status=='0'){
						console.log(response)
						this.classNumberList=response.data.data;
						this.classNumber=this.classNumberList[0].classNumber;
						this.findUser();
					}else{
						this.$message.error(response.data.message);
					}
				}).catch(error=>{
					this.$message.error(error.message);
				})
			},
			
			//查询学生by班级
			findUser(){

				var data={
					classNumber:this.classNumber
				}
				var StuUrl="http://localhost:9503/admin/studentList";
				var teacherUrl="http://localhost:9503/admin/teacherList";
				
				axios.post(StuUrl,data).then(response=>{
					if(response.data.status=='0'){
						var dealData=response.data.data;
						for(var i=0;i<dealData;i++){
							if(dealData==0){
								dealData='启用'
							}else{
								dealData='停用'
							}
						}
						this.student=dealData;
					}else{
						this.$message.error(response.data.message);
					}
				}).catch(error=>{
					this.$message.error(error.message);
				})
				
				axios.post(teacherUrl,data).then(response=>{
					if(response.data.status=='0'){
						var dealData=response.data.data;
						for(var i=0;i<dealData;i++){
							if(dealData[i].del==0){
								dealData[i].del='启用'
							}else{
								dealData[i].del='停用'
							}
						}
						this.teacher=dealData;
					}else{
						this.$message.error(response.data.message);
					}
				}).catch(error=>{
					this.$message.error(error.message);
				})
				
			},

			delUser(row,tableName){
				var data={
					table:tableName,
					uid:row.uid
				}
				axios.post("http://localhost:9503/admin/delUser",data).then(response=>{
					if(response.data.status=='0'){
						this.$message.success(response.data.message);
						this.findUser();
					}
				}).catch(e=>{
					this.$message.error(e.message);
				})
			},
			
			//模糊查询学生
			findStudentByKey(){
				if(''==this.key){
					this.$message.error("查询数据不能为空！");
				}else{
					var data={
						key:this.keyword
					}
					axios.post('http://localhost:9503/admin/findStudentListByKey',data).then(response=>{
						if(response.data.status=='0'){
							this.student=response.data.data;
							this.$message.success(response.data.message);
						}else{
							this.$message.error(response.data.message);
						}
					})
				}
			},
			
			//下载模板
			downLoadModel(){
				var data={
					
				}
				var url='http://localhost:9503/admin/createStuModel';
				var xhr = new XMLHttpRequest();
				//post方式请求后台的路径
				xhr.open('post', url, true);
				//导出的Excel是二进制数据类型，所以设置为blob
				xhr.responseType = 'blob';
				//请求头（key,value），请求头可以设置多个key-value对
				xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
				//返回成功，导出的Excel文件
				xhr.onload = function () {
					if (this.status == 200) {
						var blob = this.response;
						var a = document.createElement('a');
						var url = window.URL.createObjectURL(blob);
						a.href = url;
						//设置文件名称
						a.download = '学生账号导入模板'+'.xlsx';
						a.click();
					}
				}
				xhr.send(JSON.stringify(data));
					
					
					
				/* axios.post(url,{headers:{'Content-Type': 'application/json; application/octet-stream'}}).then(response=>{
				  let blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
		          let url = window.URL.createObjectURL(blob);
		          const link = document.createElement("a"); // 创建a标签
		          link.href = url;
		          link.download = "学生账号导入模板.xls"; // 重命名文件
		          link.click();
		          URL.revokeObjectURL(url); // 释放内存
					
				}).catch(error=>{
					
				}); */
			},
			
			createNewTeacher(){
				axios.post('http://localhost:9503/admin/createNewTeacher',this.newTeacher).then(response=>{
					
					if(response.data.status=='0'){
						this.findUser();
						this.teacherDialog=false;
						var uid=response.data.data;
						
						this.$notify({
						  title: '提示',
						  message: '新教师账号为'+uid.uid,
						  duration: 0
						});
					}
				}).catch(error=>{
					this.$message.error(error.message);
				})
			}
			
		},
		
		created() {
			this.uid=this.$store.state.userData.uid;
			this.name=this.$store.state.userData.name;
			
			this.findClassNumber();

		}
		
	
	}
</script>

<style>
	.el-header {
	    color: #333;
	    line-height: 60px;
	  }
	  
	  .el-aside {
	    color: #333;
	  }
</style>
