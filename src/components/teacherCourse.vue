<template>
	  <el-container >
		  
	    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
	      <el-menu :default-openeds="['1']">
	        <el-submenu index="1">
	          <template slot="title"><i class="el-icon-message"></i>课程工作台</template>
	          <el-menu-item-group>
	            <el-menu-item @click="itemClick('1-1')" index="1-1">课程管理</el-menu-item>
	            <el-menu-item @click="itemClick('1-2')" index="1-2">发布课程</el-menu-item>
	            <el-menu-item @click="itemClick('1-3')" index="1-3">课程附件管理</el-menu-item>
	          </el-menu-item-group>
	        </el-submenu>
	      </el-menu>
	    </el-aside>
		
		<el-container v-if="itemIndex=='1-1'">
			<el-table :data="course" ref = "multipleTable2" @expand-change="findStudentByCourse">
				<el-table-column type="expand">
				      <template slot-scope="props" >
						  已加入该课程的同学有：
							<el-tag v-for="stu in student">{{stu.stuId}}{{stu.stuName}}</el-tag>
				      </template>
				</el-table-column>
			  <el-table-column prop="name" label="课程名">
			  </el-table-column>
			  <el-table-column prop="classNumber" label="所属班级">
			  </el-table-column>
			  <el-table-column prop="createTime" label="发布时间">
			  </el-table-column>
			  <el-table-column label="操作">
				  <template slot-scope="scope">
					  <el-button type="text" @click="openWall(scope.row)">编辑</el-button>
					  <el-button type="text" @click="delCourse(scope.row)">删除</el-button>
				  </template>  
			  </el-table-column>
			</el-table>
			
			
			<el-drawer
			  title="编辑课程"
			  :visible.sync="dialog"
			  direction="ltr"
			  custom-class="demo-drawer"
			  ref="drawer"
			  size="60%"
			  >
			  <div class="demo-drawer__content">
			    <el-form :model="form">
			      <el-form-item label="课程名称" :label-width="formLabelWidth">
			        <el-input v-model="form.name" autocomplete="off"></el-input>
			      </el-form-item>
					<el-form-item label="课程内容" :label-width="formLabelWidth">
					  <quill-editor v-model="form.courseContext" ref="myQuillEditor" style="height: 300px;" :options="editorOption">
						  <!-- 自定义toolar -->
						  <div id="toolbar" slot="toolbar">
							<!-- Add a bold button -->
							<button class="ql-bold" title="加粗">Bold</button>
							<button class="ql-italic" title="斜体">Italic</button>
							<button class="ql-underline" title="下划线">underline</button>
							<button class="ql-strike" title="删除线">strike</button>
							<button class="ql-blockquote" title="引用"></button>
							<button class="ql-code-block" title="代码"></button>
							<button class="ql-header" value="1" title="标题1"></button>
							<button class="ql-header" value="2" title="标题2"></button>
							<!--Add list -->
							<button class="ql-list" value="ordered" title="有序列表"></button>
							<button class="ql-list" value="bullet" title="无序列表"></button>
							<!-- Add font size dropdown -->
							<select class="ql-header" title="段落格式">
							  <option selected>段落</option>
							  <option value="1">标题1</option>
							  <option value="2">标题2</option>
							  <option value="3">标题3</option>
							  <option value="4">标题4</option>
							  <option value="5">标题5</option>
							  <option value="6">标题6</option>
							</select>
							<select class="ql-size" title="字体大小">
							  <option value="10px">10px</option>
							  <option value="12px">12px</option>
							  <option value="14px">14px</option>
							  <option value="16px" selected>16px</option>
							  <option value="18px">18px</option>
							  <option value="20px">20px</option>
							</select>
							<select class="ql-font" title="字体">
							  <option value="SimSun">宋体</option>
							  <option value="SimHei">黑体</option>
							  <option value="Microsoft-YaHei">微软雅黑</option>
							  <option value="KaiTi">楷体</option>
							  <option value="FangSong">仿宋</option>
							  <option value="Arial">Arial</option>
							</select>
							<!-- Add subscript and superscript buttons -->
							<select class="ql-color" value="color" title="字体颜色"></select>
							<select class="ql-background" value="background" title="背景颜色"></select>
							<select class="ql-align" value="align" title="对齐"></select>
							<button class="ql-picker" title="上传图片"></button>
							<button class="ql-clean" title="还原"></button>
							<!-- You can also add your own -->
						  </div>
					  </quill-editor>
					</el-form-item>
					<el-form-item>  
					<p></p>
					<p></p>
					</el-form-item>
					<el-form-item label="所属班级" :label-width="formLabelWidth">
					  <el-input v-model="form.classNumber" autocomplete="off"></el-input>
					</el-form-item>
			    </el-form>
			    <div class="demo-drawer__footer">
			      <el-button @click="cancelForm">取 消</el-button>
			      <el-button type="primary" @click="editCourse()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
			    </div>
			  </div>
			</el-drawer>
		</el-container>
		
		<el-container v-if="itemIndex=='1-2'">
			<el-form :model="addCourseForm" :rules="addCourseRules" ref="addCourseForm">
			  <el-form-item label="课程名称" :label-width="formLabelWidth" prop="name">
			    <el-input v-model="addCourseForm.name" autocomplete="off"></el-input>
			  </el-form-item>
			  
			  <el-form-item label="所属班级" :label-width="formLabelWidth" prop="classNumber">
			    <el-input v-model="addCourseForm.classNumber" autocomplete="off"></el-input>
			  </el-form-item>
				<el-form-item label="课程内容" :label-width="formLabelWidth" style="height: 350px;" prop="context">
				  <quill-editor v-model="addCourseForm.courseContext" ref="myQuillEditor" style="height: 300px;" :options="editorOption">
					  <!-- 自定义toolar -->
					  <div id="toolbar" slot="toolbar">
						<!-- Add a bold button -->
						<button class="ql-bold" title="加粗">Bold</button>
						<button class="ql-italic" title="斜体">Italic</button>
						<button class="ql-underline" title="下划线">underline</button>
						<button class="ql-strike" title="删除线">strike</button>
						<button class="ql-blockquote" title="引用"></button>
						<button class="ql-code-block" title="代码"></button>
						<button class="ql-header" value="1" title="标题1"></button>
						<button class="ql-header" value="2" title="标题2"></button>
						<!--Add list -->
						<button class="ql-list" value="ordered" title="有序列表"></button>
						<button class="ql-list" value="bullet" title="无序列表"></button>
						<!-- Add font size dropdown -->
						<select class="ql-header" title="段落格式">
						  <option selected>段落</option>
						  <option value="1">标题1</option>
						  <option value="2">标题2</option>
						  <option value="3">标题3</option>
						  <option value="4">标题4</option>
						  <option value="5">标题5</option>
						  <option value="6">标题6</option>
						</select>
						<select class="ql-size" title="字体大小">
						  <option value="10px">10px</option>
						  <option value="12px">12px</option>
						  <option value="14px">14px</option>
						  <option value="16px" selected>16px</option>
						  <option value="18px">18px</option>
						  <option value="20px">20px</option>
						</select>
						<select class="ql-font" title="字体">
						  <option value="SimSun">宋体</option>
						  <option value="SimHei">黑体</option>
						  <option value="Microsoft-YaHei">微软雅黑</option>
						  <option value="KaiTi">楷体</option>
						  <option value="FangSong">仿宋</option>
						  <option value="Arial">Arial</option>
						</select>
						<!-- Add subscript and superscript buttons -->
						<select class="ql-color" value="color" title="字体颜色"></select>
						<select class="ql-background" value="background" title="背景颜色"></select>
						<select class="ql-align" value="align" title="对齐"></select>
						<button class="ql-picker" title="上传图片"></button>
						<button class="ql-clean" title="还原"></button>
						<!-- You can also add your own -->
					  </div>
				  </quill-editor>
				</el-form-item>
				<el-form-item style="margin-left: 50%;">
					<el-button type="primary" @click="addCourse">发布课程</el-button>
					<el-button @click="formReset('addCourseForm')">重置输入</el-button>
				</el-form-item>
				
			</el-form>
		</el-container>
		
		<el-container v-if="itemIndex=='1-3'" >
			<el-form style="width: 70%;">
				<el-form-item>
					<el-button type="primary" @click="courseDialog=true" style="height: 50px;">点击上传新的附件</el-button>
				</el-form-item>
				<el-form-item>
					<el-table :data="attachmentList" ref = "multipleTable3">
					  <el-table-column prop="name" label="附件名">
					  </el-table-column>
					  <el-table-column prop="courseName" label="所属课程">
					  </el-table-column>
					  <el-table-column prop="upTime" label="上传时间">
					  </el-table-column>
					  <el-table-column label="操作">
						  <template slot-scope="scope">
							  <el-button type="text" @click="delAttachment(scope.row)">删除</el-button>
						  </template>  
					  </el-table-column>
					</el-table>
				</el-form-item>
			</el-form>
				
			
			<el-drawer
			  title="上传附件"
			  :visible.sync="courseDialog"
			  direction="ltr"
			  custom-class="demo-drawer"
			  ref="drawer"
			  >
			  <div class="demo-drawer__content">
			    <el-form >
			      <el-form-item label="附件所属课程" :label-width="formLabelWidth">
			        <el-select v-model="attaCourseId" placeholder="请选择课程">
			          <el-option
			                v-for="item in course"
			                :key="item.courseId"
			                :label="item.name"
			                :value="item.courseId">
			              </el-option>
			        </el-select>
			      </el-form-item>
				  <el-form-item label="附件名称" :label-width="formLabelWidth">
					  <el-input v-model="attachmentName" autocomplete="off"></el-input>
				  </el-form-item>
				  <el-form-item>
					  <el-upload
					    class="upload-demo"
					    action="http://localhost:9501/teacherCourse/upAttachment"
					    :on-success="upSuccess"
					    multiple
					    :data="attachment"
					    :limit="1"
					    :file-list="fileList">
					    <el-button
					  	type="primary" 
					    @click="upAttachment">上传附件</el-button>
					  </el-upload>
				  </el-form-item>
			    </el-form>
			  </div>
			</el-drawer>		
		</el-container>
		
		</el-container>
	  
</template>

<script>
	import axios from 'axios'
	
	import {
		    Quill,
		    quillEditor
		  } from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	
	//引入font.css 
	import '../assets/css/font.css'
	
	// 自定义字体大小
	let Size = Quill.import('attributors/style/size')
	Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px']
	Quill.register(Size, true)
	
	// 自定义字体类型
	var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif',
		'宋体', '黑体'
	]
	var Font = Quill.import('formats/font')
	Font.whitelist = fonts
	Quill.register(Font, true)
	
	
	
	export default{
		components: {
		      quillEditor
		    },
		data() {
			return {
				  
				  //页面相关以及个人信息
				  itemIndex:'1-1',
				  uid:'',
				  username:'',
				  teacher:'',
				  
				  
				  multipleTable2:[],
				  homeworkData:[],
				  dialog: false,
				  loading: false,
				  form: {
				          name:'',
				  		classNumber:'',
				  		teacher:'',
				  		courseContext:'',
						courseId:''
				  },
				  addCourseForm:{
					  name:'',
					  classNumber:'',
					  teacher:'',
					  courseContext:'',
				  },
				  
				  
				  addCourseRules:{
					  name:[
						  {required: true, message: '请输入课程名称', trigger: 'blur'}
					  ],
					  
					  classNumber:[
						  {required: true, message: '请输入班级号', trigger: 'blur'}
					  ],
				  },
				  
				  formLabelWidth: '100px',
				  timer: null,
				
				//课程管理
				course:[],
				courseDialog:false,
				attachmentList:[],
				attachment:{
					uid:'',
					courseId:'',
					name:'',
				},
				attachmentName:'',
				attaCourseId:'',
				fileList:[],
				multipleTable3:[],
				student:[],
				
				//富文本处理
				editorOption: {
				  placeholder: "请输入",
				  theme: "snow", // or 'bubble' 
				  modules: {
					toolbar: {
					  container: '#toolbar'
					}
				  }
				},
		      }
		    },
			
		methods:{
			handleExceed(files, fileList) {
			        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			
			itemClick(index){
				this.itemIndex=index;
				
			},
			
			formReset(formName){
				this.$refs[formName].resetFields();
			},
			
			getCourseList(){
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
			},
			
			openWall(row){
				this.form.name=row.name;
				this.form.classNumber=row.classNumber;
				this.form.teacher=row.teacher;
				this.form.courseId=row.courseId;
				this.form.courseContext=row.courseContext;
				this.dialog=true;
			},
			
			editCourse(){
				axios.post('http://localhost:9501/teacherCourse/editCourse',this.form).then(response=>{
					console.log(response);
					if(response.data.status=='0'){
						this.$message({
							type: 'success',
							message: response.data.message
						});
						this.getCourseList();
					}else{
						this.$message.error(response.data.status);
					}
				}).catch(error=>{
					console.log(error.message);
					this.$message.error(error.message);
				})
				
				this.getCourseList();
			},
			
			cancelForm() {
			  this.loading = false;
			  this.dialog = false;
			  clearTimeout(this.timer);
			},
			
			delCourse(row){
				var isdel=1;
				this.$confirm('课程删除后可以联系管理员恢复，但是相应的作业信息以及附件信息都会被删除，请问是否继续删除?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  axios.post('http://localhost:9501/teacherCourse/delCourse',row).then(res=>{
				  	if(res.data.status=='0'){
				  		this.$message.success(res.data.message);
				  		this.getCourseList();
				  	}else{
				  		this.$message.error(res.data.message);
				  	}
				  }).catch(error=>{
				  	this.$message.error(error.message);
				  })
				}).catch(() => {
				           
				});
				if(isdel==0){
					
				}
			},
			
			addCourse(){
				this.$refs.addCourseForm.validate((valid) => {
				  if (valid) {
					this.addCourseForm.teacher=this.uid;
					axios.post('http://localhost:9501/teacherCourse/addCourse',this.addCourseForm).then(response=>{
						if(response.data.status=='0'){
							this.$message.success(response.data.message);
							this.getCourseList();
						}else{
							this.$message.error(response.data.message);
						}
					}).catch(error=>{
						this.$message.error(error.message);
					})
				  } else {
					this.$message.error('请输入课程名称以及所属班级！');
				  }
				});
				
			},
			
			//上传前参数处理
			upAttachment(){
				this.attachment.uid=this.uid;
				this.attachment.courseId=this.attaCourseId
				this.attachment.name=this.attachmentName;
			},
			//上传成功回调
			upSuccess(response){
				this.$message({
				  type: 'success',
				  message:  '附件上传成功！'
				});
				console.log(response);
				this.attachmentList=response.data.data;
			},
			
			//删除附件
			delAttachment(row){
				axios.post('http://localhost:9501/teacherCourse/delAttachment',row).then(response=>{
					if(response.data.status=='0'){
						this.$message.success(response.data.message);
					}else{
						this.$message.error(response.data.message);
					}
				}).catch(error=>{
					this.$message.error(error.message);
				})
			},
			
			findAttachmentList(){
				var data={
					uid:this.uid
				}
				axios.post('http://localhost:9501/teacherCourse/findAttachmentList',data).then(res=>{
					if(res.data.status=='0'){
						this.attachmentList=res.data.data;
						this.findAttachmentList();
					}else{
						this.$message.error('附件列表查询失败');
					}
				}).catch(error=>{
					this.$message.error(eroor.message);
				})
			},
			
			findStudentByCourse(row,expandedRows){
				console.log(row);
				var data={
					courseId:row.courseId
				}
				axios.post('http://localhost:9501/teacherCourse/findStudentByCourse',data).then(res=>{
					if(res.data.status=='0'){
						console.log(res);
						this.student=res.data.data;
					}else{
						this.$message.error('课程下人员查询失败');
					}
				}).catch(error=>{
					this.$message.error(eroor.message);
				})
			}
		},
		
		created(){
			this.teacher=this.$store.state.userData;
			this.uid=this.teacher.uid;
			this.username=this.teacher.name;
			this.getCourseList();
			this.findAttachmentList();
			
		}
	}
</script>

<style>
</style>



proxyTable: {
            '/api/**': {
                target: 'http://localhost:9502',
                pathRewrite:{
                    '^/api':'/'
                }
            },
        },