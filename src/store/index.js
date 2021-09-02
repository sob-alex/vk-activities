import Vue from 'vue'
import Vuex from 'vuex'
import content from './content'
import profiles from './profiles'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    content,
    profiles,
  },
})
