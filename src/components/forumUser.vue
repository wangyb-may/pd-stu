<template>

		  <el-form ref="form"  label-width="80px">
			  <el-row :gutter="20">
				  <el-col :span="12">
					  <el-form-item label="论坛昵称">
					    <el-input v-model="forumName"></el-input>
					  </el-form-item>
				  </el-col>
				  <el-col :span="6">
					  <el-form-item>
					    <el-button type="primary" @click="updateForumName">更改昵称</el-button>
					  </el-form-item>
				  </el-col>
			  </el-row>
			  <!--个人帖子-->
			  <el-row>
				  <el-collapse  accordion>
				    <el-collapse-item title="我的发帖" name="1">
				      <div v-for="post in dealPosts">
				      <el-row type="flex" class="row-bg" justify="center" >
				        <el-col :span="20">
				        	<el-card shadow="hover">	
				        	  <el-row>
				      		  <el-col :span="15"><el-link href="" target="_blank" :underline="false"><h3>{{post.title}}</h3></el-link></el-col>
				      	  </el-row>
				      	  
				      	  <el-row>
				      		  <el-col :span="4"><el-image style="width: 100px; height: 100px" :src="circleUrl" fit="cover"></el-image></el-col>
				      		  <el-col :span="15"><div v-html="post.content"></div></el-col>
				      		  <el-col :span="5">
				      			  <el-row>
				      				  <el-col :span="20"><i class="el-icon-user">{{post.createUser}}</i></el-col>
				      			  </el-row>
				      			  <el-row>
				      			  	  <el-col :span="40"><i class="el-icon-time">{{post.createTime}}</i></el-col>
				      			  </el-row>
				      			  
				      			  <el-row>
				      			  	  <el-col :span="40"><i class="el-icon-menu">{{post.postType}}</i></el-col>
				      			  </el-row>
				      		  </el-col>
				      	  </el-row>
				        	</el-card>
				        </el-col>
				      </el-row>
				      </div>
				    </el-collapse-item>
				  </el-collapse>
			  </el-row>
			  <el-divider></el-divider>
			  <h4>新发帖</h4>
			  <p>帖子标题<el-input v-model="title" style="width: 500px;"></el-input>
			  <el-button type="primary" @click="addPost()">发布博客</el-button>
			  </p>
			  
			  
			  <!--发帖-->
			  <el-row>
				  <quill-editor v-model="content" ref="myQuillEditor" style="height: 300px;" :options="editorOption">
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
			  </el-row>
			  
		  </el-form>
			  
		  
	  
</template>

<script>
	import axios from 'axios'
	import Vuex from 'vuex'
	
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
	
	data(){
		return {
			uid:'',
			forumName:'',
			
			student:'',
			rawPosts:[],
			dealPosts:[],
			title:'',
			
			content: '',
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
		
		
		
		updateForumName(){
			//测试注释
			console.log(this.ForumUser);
			var url=this.$route.path.split('/');
			
			var tableName='pd_'+url[1];
			axios.get('http://localhost:9505/post/updateForumName',{params:{
				uid:this.uid,
				forumName:this.forumName,
				table:tableName
				}
			}).then(response=>{
				if(response.data.status=='0'){	
					this.$message({
					          message: response.data.message,
					          type: 'success'
					});
					this.student.forumName=this.forumName;
					this.$store.commit('setUserData',this.student);
				}
				else{
					this.$message.error(response.data.message);
				}
			}).catch(error=>{
				this.$message.error(error.message);
			})
		},
		
		//获取帖子数据
		findUserPostList(){
			console.log(this.student.uid);
			axios.get("http://localhost:9505/post/userPostList?userId="+this.student.uid).then(res=>{
				this.rawPosts=res.data.data;
				console.log(this.rawPosts);
				this.dealPosts=this.dealPostsData(this.rawPosts);
			}).catch(error=>{
				this.$message.error(error.message);
			})
		},
		
		//帖子数据处理
		dealPostsData(posts){
			for(var i=0;i<posts.length;i++){
				if(posts[i].postType==1){
					posts[i].postType="灌水帖";
				}else{
					posts[i].postType="学术贴";
				}
				
				if(posts[i].content.length>=40){
					posts[i].content=posts[i].content.slice(0,40)+"...";
				}
			}
			return posts;
		},
		
		addPost(){
			var data={
				content:this.content,
				createUser:this.uid,
				title:this.title,
				postType:0
			}
			axios.post('http://localhost:9505/post/add',data).then(response=>{
				if(response.data.status=='0'){
					this.$message.success(response.data.message);
					this.findUserPostList()
				}
			}).catch(err=>{
				this.$message.error(response.data.message);
			})
		}
		
		
	},
	
	mounted(){
		
	},
	
	created(){
		
		this.student=this.$store.state.userData;
		this.uid=this.student.uid;
		if(this.student.forumName!=null&&this.student.forumName!=""){
			this.forumName=this.student.forumName;
		}
		this.findUserPostList();
		
	}
	
	
}
</script>

<style>
</style>
