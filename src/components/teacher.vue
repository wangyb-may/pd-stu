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
			
		    <el-menu-item index="/teacher/homework">作业工作台</el-menu-item>
		    <el-menu-item index="/teacher/course">课程工作台</el-menu-item>
		    <el-menu-item index="t/forum">论坛交流</el-menu-item>
			<el-submenu index="4" style="justify-content: flex-end;">
				<template slot="title">
					<el-avatar :src="imageUrl"></el-avatar>
					{{name}}
				</template>
				
				<el-menu-item index="">个人中心</el-menu-item>
				<el-menu-item index="4-2">使用帮助</el-menu-item>
				<el-menu-item index="/login">退出登录</el-menu-item>
			</el-submenu>
		  </el-menu>
	  </el-header>
	  <el-container>
	    
	    <el-main>
			<router-view></router-view>
			
		</el-main>
	  </el-container>
	</el-container>
	
</template>

<script>
	import axios from 'axios'
	import teacherCourse from './teacherCourse.vue'
	import teacherHomework from './teacherHomework.vue'
	export default{
		data(){
			return {
				index:'1',
				
				uid:'',
				name:'',
				imageUrl:"../src/static/image/x.jpg",
			}
		},
		
		components:{teacherCourse,teacherHomework},
		
		methods:{
			handMenuSelect(key,keyPath){
				this.$router.replace({
					path:key
				})
				// this.index=key;
				// if(this.index=="4-3"){
				// 	this.$router.push({
				// 		path:'/logIn'
				// 	})
				// }
			},
			
		
			
		},
		
		created() {
			//var data=this.$route.query.userData;
			this.uid=this.$store.state.userData.uid;
			this.name=this.$store.state.userData.name;
			
			this.$router.replace({
				path:'/teacher/homework'
			})
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
