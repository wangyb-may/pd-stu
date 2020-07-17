<template>
	<el-tabs type="border-card">
	  <el-tab-pane label="Python基础学习">
		  <iframe class="ifr" src="https://www.liaoxuefeng.com/wiki/1016959663602400"></iframe>
	  </el-tab-pane>
	  
	  <el-tab-pane label="课程学习">
		  <div v-if="isDetail==0">
			  <div style="width: 30%;">
				  <el-input placeholder="搜索课程、教师" v-model="keywords" class="input-with-select">
					<el-button slot="append" icon="el-icon-search" @click="findCourseList(1)"></el-button>
				  </el-input>
			  </div>
			  
			  <el-row>
			    <el-col :span="5" v-for="(list,index) in courseList" :key="index" :offset="index > 0 ? 1 : 0">
			      <el-card shadow="hover" :body-style="{ padding: '0px' }">
			        <img src="../assets/logo.png" class="image">
			        <div style="padding: 14px;">
			          <span>{{list.name}}</span>
			          <div class="bottom clearfix">
			            <time class="time">{{ list.createTime }}</time>
			  					<time class="time">{{list.teacher}}</time>
			            <el-button type="text" class="button" @click="detail(index)">课程详情</el-button>
			          </div>
			        </div>
			      </el-card>
			    </el-col>
			  </el-row>
		  </div>
		  
		  <div v-else-if="isDetail==1">
			  <el-page-header @back="goBack" content="课程详情页面" ></el-page-header>
			  <h2 style="text-align: center;">{{courseDetail.name}}</h2>
			  <h4 style="text-align: center;">创建时间:{{courseDetail.createTime}}   任课教师:{{courseDetail.teacher}}</h4>
			  <div v-html="courseDetail.courseContext"></div>
			  <el-button type="button" @click="open">点击加入此课程</el-button>
		  </div>
		  
		  
	  </el-tab-pane>
	  
	  <el-tab-pane label="教学辅助资料">
		  	<el-table :data="attachmentList" ref = "multipleTable" >
		  	  <el-table-column prop="name" label="附件名">
		  	  </el-table-column>
		  	  <el-table-column prop="courseName" label="所属课程">
		  	  </el-table-column>
		  	  <el-table-column prop="upTime" label="上传时间">
		  	  </el-table-column>
		  	  <el-table-column label="操作">
		  		  <template slot-scope="scope">
		  			  <el-button type="text" @click="downloadAttachment(scope.row)">下载</el-button>
		  		  </template>  
		  	  </el-table-column>
		  	</el-table>
	  </el-tab-pane>
	</el-tabs>
</template>

<script>
	import axios from 'axios'
	export default{
		data() {
		    return {
			  student:'',
		      courseList:[],
			  url:'http://localhost:9502/stuCourse',
			  keywords:'',
			  isDetail:'',
			  courseDetail:'',
			  chooseMessage:'',
			  chooseStatus:'',
			  
			  //附件
			  attachmentList:{},
			  multipleTable:''
		    }
		  },
		  
		  methods:{
			  findCourseList(isByKey){
				  if(isByKey==1){
					  //this.courseList=null;
					  var data={
						  keywords:this.keywords
					  }
				  }
				  axios.post(this.url+"/findList",data).then(response=>{
					  if(response.data.status=='0'){
						  this.courseList=response.data.data;
					  }else{
						  this.$message.error("未查到相关的课程信息");
					  }
					  
				  }).catch(error=>{
						this.$message.error("未查到相关的课程信息");
					})
			
			  },
			  
			  goBack(){
				  this.isDetail=0;
			  },
			  
			  detail(index){
				  this.isDetail=1;
				  this.courseDetail=this.courseList[index];
				  
			  },
			  
			  open(){
				  this.$confirm('你将加入此课程，并同时获取该课程目前的作业信息，请问是否确定加入？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					 beforeClose: (action, instance, done) => {
						if (action === 'confirm') {
						  instance.confirmButtonLoading = true;
						  instance.confirmButtonText = '添加中...';
						  var data={
							  courseId:this.courseDetail.courseId,
							  uid:this.student.uid
						  }
						  axios.post('http://localhost:9502/stuCourse/chooseCourse',data).then(response=>{
							  if(response.data.status=='0'){
								  this.chooseStatus='success'
							  }else{
								  this.chooseStatus='error'
							  }
							  this.chooseMessage=response.data.message;
							  instance.confirmButtonLoading = false;
							  done();
						  }).catch(error=>{
							  this.chooseMessage=error;
							  instance.confirmButtonLoading = false;
							  done();
						  });
						} else {
						  done();
						}
					  }
				  }).then(action  => {
					  this.$message({
						  type: this.chooseStatus,
						  message:  this.chooseMessage
						});
				  }).catch(() => {
					
				  });
			  },
			  
			  findAttachmentList(){
				  var data={
					  uid:this.student.uid
				  }
				  axios.post('http://localhost:9502/stuCourse/findAttachmentList',data).then(response=>{
					  if(response.data.status=='0'){
						  this.attachmentList=response.data.data;
					  }else{
						  this.$message.error('查询附件列表失败');
					  }
				  }).catch(error=>{
					  this.$message.error('查询附件列表失败');
				  })
			  },
			  
			  downloadAttachment(row){
				  window.location.href=row.upUrl;
			  }
			  
		  },
		  
		  created(){
		  	this.findCourseList(0);
			this.isDetail=0;
			this.student=this.$store.state.userData;
			this.findAttachmentList();
		  }
		  
	}
</script>

<style>
	.ifr{
		width: 100%;
		height:1300px;
	}
	.time {
	    font-size: 13px;
	    color: #999;
	  }
	  
	  .bottom {
	    margin-top: 13px;
	    line-height: 12px;
	  }
	
	  .button {
	    padding: 0;
	    float: right;
	  }
	
	  .image {
	    width: 100%;
	    display: block;
	  }
	
	  .clearfix:before,
	  .clearfix:after {
	      display: table;
	      content: "";
	  }
	  
	  .clearfix:after {
	      clear: both
	  }
</style>
