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
import teacherPersonal from './components/teacherPersonal.vue'
import adminLog from './components/adminLog.vue'
import manage from './components/manage.vue'
import store from './store/'



Vue.use(ElementUI)
Vue.use(VueRouter);
Vue.use(VueQuillEditor);

const routes=[
	// {path:'/', redirect: '/logIn',component:logIn},
	{path:'/logIn',name:'logIn',component:logIn},
	{path:'/adminLog',name:'adminLog',component:adminLog},
	{
		path:'/student',
		name:'student',
		component:student,
		children:[
			{path:'/student/study',name:'stuStudy',component:stuStudy},
			{
				path:'/student/personal',name:'stuPersonal',component:stuPersonal,
				children:[
					{path:'/student/forumUser',name:'forumUser',component:forumUser}
				]
			},
			{path:'/student/homework',name:'stuHomework',component:stuHomework},
			{path:'s/forum',name:'forum',component:forum},
		]
	},
	
	{
		path:'/teacher',
		name:'teacher',
		component:teacher,
		children:[
			{path:'/teacher/course',name:'teacherCourse',component:teacherCourse},
			{path:'/teacher/homework',name:'teacherHomework',component:teacherHomework},
			{path:'t/forum',name:'forum',component:forum},
			{path:'/teacher/personal',name:'teacherPersonal',component:teacherPersonal,
			children:[
				{path:'/teacher/forumUser',name:'forumUser',component:forumUser}
			]
			}
		]
	},
	
	{
		path:'/manage',
		name:'manage',
		component:manage
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
