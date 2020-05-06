import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueQuillEditor  from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './assets/css/font.css'

import logIn from './components/logIn'
import student from './components/student'
import stuStudy from './components/stuStudy'
import stuHomework from './components/stuHomework'
import stuPersonal from './components/stuPersonal'
import forum from './components/forum'
import forumUser from './components/forumUser'
import teacher from './components/teacher'
import teacherCourse from './components/teacherCourse'
import teacherHomework from './components/teacherHomework'
import store from './store/'



Vue.use(ElementUI)
Vue.use(VueRouter);
Vue.use(VueQuillEditor);

const routes=[
	// {path:'/', redirect: '/logIn',component:logIn},
	{path:'/logIn',name:'logIn',component:logIn},
	{
		path:'/student',
		name:'student',
		component:student,
		children:[
			{path:'/student/study',name:'stuStudy',component:stuStudy},
			{
				path:'/student/personal',name:'stuPersonal',component:stuPersonal,
				children:[
					{path:'/student/personal/forumUser',name:'forumUser',component:forumUser}
				]
			},
			{path:'/student/homework',name:'stuHomework',component:stuHomework},
			{path:'/forum',name:'forum',component:forum},
		]
	},
	
	{
		path:'/teacher',
		name:'teacher',
		component:teacher,
		children:[
			{path:'/teacher/course',name:'teacherCourse',component:teacherCourse},
			{path:'/teacher/homework',name:'teacherHomework',component:teacherHomework}
		]
	}
]

const routers=new VueRouter({
	routes
})

new Vue({
  el: '#app',
  store,
  components:{logIn},
  router:routers,
  render: h => h(App)
})
