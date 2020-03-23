import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {

    //这里放全局参数
    userData:{}

  },

  mutations: {

    //这里是set方法

    setUserData(state,value){

            state.userData = value;

        }

  },

    getters: {

    //get方法

        getUserData: state => state.userData

    },

})
