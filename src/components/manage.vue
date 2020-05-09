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
					教师{{name}}
				</template>
			</el-submenu>
		  </el-menu>
	  </el-header>
	  <el-container>
	    
	    <el-main>
			<el-container v-if="index=='1'">
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
				
			}
		},
		
		
		methods:{
			handMenuSelect(key,keyPath){
				this.index=key;
			},
			
			//查询班级
			findClassNumber(){
				var url="http://localhost:9503/admin/class";
				var data={};
				axios.post(url).then(response=>{
					if(response.data.status=='0'){
						console.log(response)
						this.classNumberList=response.data.data;
					}else{
						this.$message.error(response.data.message);
					}
				}).catch(error=>{
					this.$message.error(error.message);
				})
			},
			
			//查询学生by班级
			findUser(){
				
				this.classNumber=this.classNumberList[0].classNumber;
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
			}
			
		},
		
		created() {
			this.uid=this.$store.state.userData.uid;
			this.name=this.$store.state.userData.name;
			
			this.findClassNumber();
			this.timer = setTimeout(()=>{   //设置延迟执行
			    this.findUser()
			},1000);

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
