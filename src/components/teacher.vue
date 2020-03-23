<template>
	
		  <el-tabs type="border-card">
			  <el-tab-pane label="教师工作台">
				  <el-container style="height: 500px; border: 1px solid #eee">
				    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
				      <el-menu :default-openeds="['1','2']">
				        <el-submenu index="1">
				          <template slot="title"><i class="el-icon-message"></i>作业工作台</template>
				          <el-menu-item-group>
				            <el-menu-item @click="itemClick('1-1')" index="1-1">作业提交状态</el-menu-item>
							<el-menu-item @click="itemClick('1-2')" index="1-2">发布作业</el-menu-item>
				          </el-menu-item-group>
				        </el-submenu>
				        <el-submenu index="2">
				          <template slot="title"><i class="el-icon-menu"></i>课程工作台</template>
				          <el-menu-item-group>
				            <el-menu-item @click="itemClick('2-1')" index="2-1">课程管理</el-menu-item>
				            <el-menu-item @click="itemClick('2-2')" index="2-2">班级课程管理</el-menu-item>
				          </el-menu-item-group>
				        </el-submenu>
				      </el-menu>
				    </el-aside>
				    
					
				    <el-container v-if="itemIndex=='1-1'">
				      <el-header style="text-align: right; font-size: 12px">
						  <el-select v-model="classNumber" placeholder="课程" >
						      <el-option
						        v-for="item in classSelect"
						        :key="item.value"
						        :label="item.label"
						        :value="item.value">
						      </el-option>
						    </el-select>
							<el-select v-model="homework" placeholder="作业" >
							    <el-option
							      v-for="item in homeworkSelect"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							  </el-select>
				        <span>{{username}}老师</span>
				      </el-header>
				      
				      <el-main>
				        <el-table :data="homeworkData">
				          <el-table-column prop="homeworkId" label="作业号">
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
				        </el-table>
				      </el-main>
				    </el-container><!--tableContainer-->
					
					
					<el-container v-if="itemIndex=='1-2'">
					  <el-header style="text-align: right; font-size: 12px">
					    <el-dropdown>
					      <i class="el-icon-setting" style="margin-right: 15px"></i>
					      <el-dropdown-menu slot="dropdown">
					        <el-dropdown-item>查看</el-dropdown-item>
					        <el-dropdown-item>新增</el-dropdown-item>
					        <el-dropdown-item>删除</el-dropdown-item>
					      </el-dropdown-menu>
					    </el-dropdown>
					    <span>{{username}}</span>
					  </el-header>
					  
					  <el-main>
					    <el-table :data="tableData">
					      <el-table-column prop="date" label="日期" width="140">
					      </el-table-column>
					      <el-table-column prop="name" label="姓名" width="120">
					      </el-table-column>
					      <el-table-column prop="address" label="地址">
					      </el-table-column>
					    </el-table>
					  </el-main>
					</el-container><!--tableContainer-->
					
					
					
				  </el-container><!--largestContainer-->
			  </el-tab-pane>
			  <el-tab-pane label="教师信息修改">配置管理</el-tab-pane>

	      </el-tabs>
	  
	
</template>

<script>
	import axios from 'axios'
	export default{
		data() {
			return {
				 
				  classSelect: [],
				  classNumber: '',
				   
				  homeworkSelect: [],
				  homework: '',
						  
				  itemIndex:'',
				  uid:'',
				  username:'',
		        homeworkData: [],
				
		      }
		    },
			
		methods:{
			itemClick(index){
				this.itemIndex=index;
			},
			
			foundHomeworkInfo(){
				axios.get('http://localhost:8510/teacherHomework/findStatus?uid='+this.uid).then(
				response=>{
					var nowData=response.data.data;
					for(var i=0;i<nowData.length;i++){
						if(nowData[i].context.length>=9){
							nowData[i].context=nowData[i].context.slice(1,9)+'...';
						}
					}
					this.homeworkData=nowData;
				}).catch(error=>{
					alert(error.message)
				})
			}
		},
		
		created() {
			var data=this.$route.query;
			this.username=this.$route.query.name;
			this.uid=this.$route.query.uid;
			this.foundHomeworkInfo();
		}
	}
</script>

<style>
	.el-header {
	    background-color: #B3C0D1;
	    color: #333;
	    line-height: 60px;
	  }
	  
	  .el-aside {
	    color: #333;
	  }
</style>
