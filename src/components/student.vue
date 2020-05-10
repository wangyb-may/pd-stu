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
			
		    <el-menu-item index="/student/study">学习中心</el-menu-item>
		    <el-menu-item index="/student/homework">我的作业</el-menu-item>
		    <el-menu-item index="s/forum">论坛交流</el-menu-item>
			<el-submenu index="4" style="justify-content: flex-end;">
				<template slot="title">
					<el-avatar shape="square" :size="50" :src="imageUrl"></el-avatar>
					{{name}}
				</template>
				
				<el-menu-item index="/student/personal">个人中心</el-menu-item>
				<el-menu-item index="4-2">使用帮助</el-menu-item>
				<el-menu-item index="/login">退出登录</el-menu-item>
			</el-submenu>
		  </el-menu>
	  </el-header>
	  <el-container>
	    <!-- <el-aside width="200px">Aside</el-aside> -->
	    <el-main>
			<router-view></router-view>
			
		</el-main>
	  </el-container>
	</el-container>
</template>


<script>
	import axios from 'axios'
	import stuStudy from './stuStudy.vue'
	import stuHomework from './stuHomework.vue'
	import stuPersonal from './stuPersonal.vue'
	export default{
		data(){
			return {
				index:'1',
				
				uid:'',
				name:'',
				imageUrl:'',
			}
		},
		
		components:{stuStudy,stuHomework,stuPersonal},
		
		methods:{
			handMenuSelect(key,keyPath){
				this.$router.replace({
					path:key
				})
				
			},
			
		
			
		},
		
		created() {
			
			var data=this.$store.state.userData;
			console.log(data);
			this.uid=data.uid;
			this.name=data.name;
			this.imageUrl=data.imageUrl;
			this.$router.replace({
				path:'/student/study'
			})
		}
		

	}
</script>

<style>
	
</style>
