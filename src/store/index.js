import Vue from 'vue'
import Vuex from 'vuex'
import content from './content'
import profiles from './profiles'
import settingsFilter from './settingsFilter'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    async startSearch({dispatch}){
      await dispatch('profiles/getTargetIds')
      await dispatch('content/getLikedContent')
    }
  },
  modules: {
    content,
    profiles,
    settingsFilter
  },
})
