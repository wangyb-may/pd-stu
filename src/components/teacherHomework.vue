<template>
				  <el-container >
				    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
				      <el-menu :default-openeds="['1']">
				        <el-submenu index="1">
				          <template slot="title"><i class="el-icon-message"></i>作业工作台</template>
				          <el-menu-item-group>
				            <el-menu-item @click="itemClick('1-1')" index="1-1">作业提交状态</el-menu-item>
							<el-menu-item @click="itemClick('1-2')" index="1-2">作业管理</el-menu-item>
				          </el-menu-item-group>
				        </el-submenu>
				      </el-menu>
				    </el-aside>
				    
					
				    <el-container v-if="itemIndex=='1-1'">
						
				      <el-header style="text-align: right; font-size: 12px">
						  <el-row>
							  <el-col :span="3"><el-button type="primary" @click="downloadHomeworkList()">下载选中的学生作业</el-button></el-col>
							  <el-col :span="21">
								  <el-input
								  style="width: 300px;"
								    placeholder="搜索学生、作业、班级"
								    v-model="findInformation"
								    clearable>
								  </el-input>
								  <el-button type="primary" icon="el-icon-search" @click="getHomeworkInformation"></el-button>
								  <span>{{username}}老师</span>
							  </el-col>
						  </el-row>
						  
						  
				      </el-header>
				      
				      <el-main>
				        <el-table :data="homeworkStatuData" ref = "multipleTable">
						  <el-table-column
							  type="selection"
							  width="55">
						  </el-table-column>
				          <el-table-column prop="homeworkName" label="作业名">
				          </el-table-column>
				          <el-table-column prop="context" label="内容">
				          </el-table-column>
						  <el-table-column prop="stuName" label="学生姓名">
						  </el-table-column>
						  <el-table-column prop="classNumber" label="班级号">
						  </el-table-column>
						  <el-table-column prop="upStatu" label="提交状态">
						  </el-table-column>
						  <el-table-column prop="score" label="评分">
						  </el-table-column>
						  <el-table-column label="操作">
							  <template slot-scope="scope">
								  <el-button type="text" size="medium" @click="downloadHomework(scope.row)">下载作业</el-button>
								  <el-button type="text" @click="giveScore(scope.row)">评分</el-button>
							  </template>  
						  </el-table-column>
				        </el-table>
				      </el-main>
				    </el-container><!--tableContainer-->
					
					
					<el-container v-if="itemIndex=='1-2'">
					  <el-header style="text-align: right; font-size: 12px">
						  <el-button type="primary" @click="dialog = true">发布新作业</el-button>
						  <span>{{username}}老师</span>
					  </el-header>
					  <el-main>
						  <el-table :data="homeworkData" ref = "multipleTable2">
						   
						    <el-table-column prop="name" label="作业名">
						    </el-table-column>
						    <el-table-column prop="context" label="内容">
						    </el-table-column>
						    <el-table-column prop="courseid" label="所属课程">
						    </el-table-column>
						    <el-table-column prop="classnumber" label="所属班级">
						    </el-table-column>
						    <el-table-column prop="createtime" label="发布时间">
						    </el-table-column>
						    <el-table-column label="操作">
						  	  <template slot-scope="scope">
						  		  <el-button type="text" @click="delHomework(scope.row)">删除</el-button>
						  	  </template>  
						    </el-table-column>
						  </el-table>
					  </el-main>
					  
					  <el-drawer
					    title="添加新作业"
					    :visible.sync="dialog"
					    direction="ltr"
					    custom-class="demo-drawer"
					    ref="drawer"
					    >
					    <div class="demo-drawer__content">
					      <el-form :model="form">
					        <el-form-item label="作业名称" :label-width="formLabelWidth">
					          <el-input v-model="form.name" autocomplete="off"></el-input>
					        </el-form-item>
							<el-form-item label="作业内容" :label-width="formLabelWidth">
							  <el-input type="textarea" v-model="form.context" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="所属班级" :label-width="formLabelWidth">
							  <el-input v-model="form.classnumber" autocomplete="off"></el-input>
							</el-form-item>
					        <el-form-item label="所属课程" :label-width="formLabelWidth">
					          <el-select v-model="form.courseid" placeholder="请选择课程">
					            <el-option
					                  v-for="item in course"
					                  :key="item.courseId"
					                  :label="item.name"
					                  :value="item.courseId">
					                </el-option>
					          </el-select>
					        </el-form-item>
					      </el-form>
					      <div class="demo-drawer__footer">
					        <el-button @click="cancelForm">取 消</el-button>
					        <el-button type="primary" @click="handleClose()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
					      </div>
					    </div>
					  </el-drawer>
					 
					</el-container><!--tableContainer-->
					
					
					
				  </el-container><!--largestContainer-->
			  
			  

	  
	
</template>

<script>
	import axios from 'axios'
	export default{
		data() {
			return {
				 //筛选数据（根据班级、学生、作业)
				  findInformation:'',
				  
				  //页面相关以及个人信息
				  itemIndex:'1-1',
				  uid:'',
				  username:'',
				  teacher:'',
		        
				
				//下载作业以及评分
				homeworkStatuData:[],
				multipleTable:[],
				giveScoreStatu:'',
				giveScoreMessage:'',
				
				//作业管理
				multipleTable2:[],
				homeworkData:[],
				dialog: false,
				loading: false,
				form: {
				        name:'',
						classnumber:'',
						teacherid:'',
						context:'',
						courseid:''
				},
				formLabelWidth: '80px',
				timer: null,
				
				//课程管理
				course:[],
		      }
		    },
			
		methods:{
			itemClick(index){
				this.itemIndex=index;
			},
			
			//获取全部作业数据
			foundHomeworkInfo(){
				axios.get('http://localhost:9501/teacherHomework/findStatus?uid='+this.uid).then(
				response=>{
					var nowData=response.data.data;
					for(var i=0;i<nowData.length;i++){
						if(nowData[i].context.length>=9){
							nowData[i].context=nowData[i].context.slice(1,9)+'...';
						}
					}
					this.homeworkStatuData=nowData;
				}).catch(error=>{
					alert(error.message)
				})
			},
			
			//单个下载作业
			downloadHomework(row){
				window.location.href=row.url;
			},
			
			
			//批量下载选中作业
			downloadHomeworkList(){
					console.log(this.$refs.multipleTable.selection);
					var data=this.$refs.multipleTable.selection;
					var isOk=0;
					for(var i=0;i<data.length;i++){
						if(data[i].url==null){
							this.$message.error("不能下载还未提交的作业！");
							isOk=1;
							break;
						}
					}
					var url='http://localhost:9501/teacherHomework/downloadList';
					if(isOk==0){
						axios.post(url,data,{headers:{'Content-Type': 'application/json; application/octet-stream'}}).then(response=>{
						  let blob = new Blob([response.data], { type: "application/zip" });
				          let url = window.URL.createObjectURL(blob);
				          const link = document.createElement("a"); // 创建a标签
				          link.href = url;
				          link.download = "作业批量下载"+new Date()+".zip"; // 重命名文件
				          link.click();
				          URL.revokeObjectURL(url); // 释放内存
							
						}).catch(error=>{
							
						});
					}
					
			},
			
			//评分
			giveScore(row){
				if(row.upStatu=='未提交'){
					this.$message.error('该同学的作业还未提交不能评分！');
					return;
				}
				this.$prompt('请输入分数', '评分', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  inputPattern: /^[0-9]*$/,
				  inputErrorMessage: '请输入数字',
				  beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
					  instance.confirmButtonLoading = true;
					  instance.confirmButtonText = '评分中...';
					  done();
					} else {
					  done();
					}
				   }
				}).then(({ value }) => {
					var data=row;
					row.score=value;
					axios.post('http://localhost:9501/teacherHomework/giveScore',data).then(response=>{
					  if(response.data.status=='0'){
						  this.$message({
								type: 'success',
								message: response.data.message
						  });
					  }else{
						 this.$message({
						 	type: 'error',
						 	message: response.data.message
						 }); 
					  }
					}).catch(error=>{
						this.$message({
							type: 'error',
							message: response.data.message
						});
					});
				  
				}).catch(() => {
				       
				});
			},
			
			//关键词搜索学生作业提交状态
			getHomeworkInformation(){
				var data={
					uid:this.uid,
					key:this.findInformation
				}
				
				axios.post('http://localhost:9501/teacherHomework/findHomeworkStatuBykey',data).then(response=>{
					if(response.data.status=='0'){
						
						var nowData=response.data.data;
						for(var i=0;i<nowData.length;i++){
							if(nowData[i].context.length>=9){
								nowData[i].context=nowData[i].context.slice(1,9)+'...';
							}
						}
						this.homeworkStatuData=nowData;
						this.$message.success(response.data.message);
					}else{
						this.$message.error(response.data.message);
					}
				})
			},
			
			//删除作业
			delHomework(row){
				var responseData='';
				var errorData='';
				this.$confirm('你将删除此作业，并且有关的作业提交信息将全部删除，无法再次回复，请问是否继续？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				 beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
					  instance.confirmButtonLoading = true;
					  instance.confirmButtonText = '删除中...';
					  var data={
					  	homeworkId:row.id
					  }
					  axios.post('http://localhost:9501/teacherHomework/delHomework',data).then(response=>{
						  if(response.data.status=='0'){
							  console.log(response)
							  responseData=response;
							  responseData.data.status='success';
						  }else{
							  responseData=response;
							  responseData.data.status='error';
						  }
					  	
					  }).catch(error=>{
						  errorData=error;
					  })
					  instance.confirmButtonLoading = false;
					  done();
					} else {
					  done();
					}
				  }
				}).then(action=>{
					console.log(responseData);
					this.$message({
					  type: 'success',
					  message:  '删除成功'
					});
				}).catch(error=>{
					
				})
				this.getHomeworkList();
			},
			
			//获取全部作业信息
			getHomeworkList(){
				var data={
					uid:this.uid
				}
				axios.post('http://localhost:9501/teacherHomework/findHomeworkList',data).then(response=>{
					if(response.data.status=='0'){
						var nowData=response.data.data;
						for(var i=0;i<nowData.length;i++){
							if(nowData[i].context.length>=9){
								nowData[i].context=nowData[i].context.slice(1,9)+'...';
							}
						}
						this.homeworkData=nowData;
					}else{
						this.$message.error(response.data.message);
					}
				}).catch(error=>{
					this.$message.error(error);
				})
			},
			
			//添加作业
			handleClose() {
					  this.form.teacherid=this.uid;
					  axios.post('http://localhost:9501/teacherHomework/addHomework',this.form).then(response=>{
					  	if(response.data.status=='0'){
					  		this.$message.success(response.data.message);
							this.getHomeworkList();
					  	}else{
					  		this.$message.error(response.data.message);
					  	}
					  }).catch(error=>{
					  	this.$message.error(error);
					  })
					  this.getHomeworkList();
					  //done();
			},
			cancelForm() {
			  this.loading = false;
			  this.dialog = false;
			  clearTimeout(this.timer);
			},
			
			//查询课程列表
			findCourseList(){
				var data={
					uid:this.uid
				}
				axios.post('http://localhost:9501/teacherCourse/findCourse',data).then(response=>{
					if(response.data.status=='0'){
						this.course=response.data.data
					}else{
						this.$message.error(response.data.message)
					}
				}).catch(error=>{
					this.$message.error("连接服务器失败");
				})
			}
			  
		},
		
		
		created() {
			
			
			this.teacher=this.$store.state.userData;
			this.uid=this.teacher.uid;
			this.username=this.teacher.name;
			console.log(this.teacher);
			this.foundHomeworkInfo();
			this.getHomeworkList();
			this.findCourseList();
		}
	}
</script>

<style>
	
	  
	  .el-aside {
	    color: #333;
	  }
</style>
