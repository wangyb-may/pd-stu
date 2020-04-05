<template>
	
	<el-container>
	  <el-header>
		<div style="width: 30%;">
			<el-input placeholder="按作业名,教师,课程名搜索作业" v-model="keywords" class="input-with-select">
				<el-button slot="append" icon="el-icon-search" @click="findByKeywords(isShow)"></el-button>
			</el-input>
			<el-switch
			  v-model="isShowHadUp"
			  active-text="不显示已提交的作业">
			</el-switch>
		</div>
	</el-header>
	  <el-main>
		  <el-table :data="homeworkData">
		    
		    <el-table-column prop="homeworkName" label="作业名">
		    </el-table-column>
		    <el-table-column prop="context" label="作业内容">
		    </el-table-column>
		    <el-table-column prop="courseName" label="对应课程">
		    </el-table-column>
		    <el-table-column prop="teacherName" label="发布教师" width="100">
		    </el-table-column>
		    <el-table-column prop="upTime" label="提交时间" width="100">
		    </el-table-column>
		    <el-table-column prop="upStatu" label="提交状态" width="100">
		    </el-table-column>
		    <el-table-column prop="score" label="分数" width="50">
		    </el-table-column>
			<el-table-column  fixed="right" label="操作" width="100">
			  <template slot-scope="scope">
				<el-button
				  type="text"
				  size="mini"
				  @click="checkDetail(scope.$index, scope.row)">详情</el-button>
				  <el-upload
				    class="upload-demo"
				    action="http://localhost:9502/student/homework/uploadHomework"
				    multiple
					:data="updata"
				    :limit="1"
				    :file-list="fileList">
				    <el-button
						type="text" 
				    	size="mini"
				    @click="upHomework(scope.$index, scope.row)">提交</el-button>
				  </el-upload>
			  </template>
			</el-table-column>
		  </el-table>
		  <div class="block" style="margin-right:auto;">
		    <p></p>
		    <el-pagination
			@current-change="handleCurrentChange"
		      layout="prev, pager, next"
		      :total="pageTotal*10">
		    </el-pagination>
		  </div>
	  </el-main>
	</el-container>
	
</template>

<script>
	import axios from 'axios'
	import Vuex from 'vuex'
	export default{
		data(){
			return {
				homeworkData:[],
				allData:[],
				
				keywords:'',
				stuData:'',
				updata:{
					homeworkId:'',
					uid:''
				},
				fileList:[],
				
				
				
				pageNum:1,
				pageTotal:'',
				uid:'',
				
				isShowHadUp:false,
				isUseKeyword:false,
				isShow:0
			}
		},
		
		methods:{
			
			//提交作业
			upHomework(index,row){
				this.updata.uid=this.stuData.uid;
				this.updata.homeworkId=row.homeworkId;
			},
			

			handleExceed(files, fileList) {
			        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			      },
			
			//根据关键词查询作业，关键词有课程、教师、作业名，均为模糊查询
			findByKeywords(isShow){
				
				if(this.keywords!=null){
					this.isUseKeyword=true;
					var url='http://localhost:9502/student/homework/findByKeyword';
					var data={
						pageNum:this.pageNum,
						uid:this.uid,
						keywords:this.keywords,
						isShowHadUp:isShow
					}
					this.findHomeworkPost(url,data);
				}else{
					this.pageNum=1;
					findHomeworkListByUid(this.pageNum);
				}
			},
			
			//详情按钮点击事件，显示作业的详细情况
			checkDetail(index,row){
				var context=this.allData[index].context;
				 this.$alert(context, row.homeworkName, {
				          confirmButtonText: '确定', 
				        });
			},
			
			//根据用户id查找所有作业
			findHomeworkListByUid(page,isShow){
				this.isUseKeyword=false;
				var url='http://localhost:9502/student/homework/List';
				var data={
					pageNum:page,
					uid:this.uid,
					isShowHadUp:isShow
				}
				this.findHomeworkPost(url,data);
			},
			
			//根据需求获取作业数据（需求由上级方法决定）
			findHomeworkPost(url,data){
				axios.post(url,data).then(
					response=>{
						if(response.data.status==="0"){
							this.pageTotal=response.data.data.total;
							var temp=response.data.data.pageEntity;
							
							
							//屏蔽超出长度的文字并放入后面的详情
							this.allData=JSON.parse(JSON.stringify(temp));
							this.homeworkData=temp;
							for(var i=0;i<this.homeworkData.length;i++){
								
								if(this.homeworkData[i].context.length>=5){
									this.homeworkData[i].context=this.homeworkData[i].context.slice(0,10)+'...';
								}
								if(this.homeworkData[i].homeworkName.length>=10){
									this.homeworkData[i].homeworkName=this.homeworkData[i].homeworkName.slice(0,10)+'...';
								}
							}
						}
						else{
							alert(response.data.message);
						}
					}
				).catch(error=>{
					console.log(error.message)
				})
			},
			
			//切换页码时发生效果
			handleCurrentChange:function(page){
				this.pageNum=page;
				this.ShowHadUp();
			},
			
			//监控是否需要显示已提交作业的按钮的逻辑
			ShowHadUp:function(){
				if(this.isShowHadUp==true){
					if(this.isUseKeyword==true){
						this.findByKeywords(1);
					}else{
						this.findHomeworkListByUid(this.pageNum,1);
					}
				}else if(this.isShowHadUp==false){
					
					if(this.isUseKeyword==true){
						this.findByKeywords(0);
					}else{
						this.findHomeworkListByUid(this.pageNum,0);
					}
				}
			}
			
		},
		
		//监控是否需要显示已提交作业的按钮
		watch:{
			watchFunction:function () {
				this.ShowHadUp();
			}
			
		},
		
		
		
		created() {
			this.stuData=this.$store.state.userData;
			this.uid=this.stuData.uid;
			console.log(this.uid);
			this.findHomeworkListByUid(this.pageNum,0);
		}
	}
</script>

<style>
	.el-select .el-input {
	    width: 130px;
	  }
	  .input-with-select .el-input-group__prepend {
	    background-color: #fff;
	  }
</style>
