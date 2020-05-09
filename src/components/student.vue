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
					<el-avatar :src="imageUrl"></el-avatar>
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
			<!-- <div v-if="index==='1'">
				<stuStudy></stuStudy>	
			</div>
			
			<div v-else-if="index==='2'">
				<stuHomework></stuHomework>
			</div>
			<div v-else-if="index==='3'">
				asdasdassadasdasdassdsa
			</div>
			<div v-else-if="index==='4-1'">
				<stuPersonal></stuPersonal>
			</div> -->
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
			this.uid=this.$route.query.uid;
			this.name=this.$route.query.name;
			thi.imageUrl=this.$route.query.imageUrl;
			this.$router.replace({
				path:'/student/study'
			})
		}
		

	}
</script>

<style>
	
</style>
