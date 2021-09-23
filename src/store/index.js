import Vue from 'vue'
import Vuex from 'vuex'
import content from './content'
import profiles from './profiles'
import settingsFilter from './settingsFilter'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthorized: Boolean(localStorage.getItem('api-key')),
    isModalOpen: false,
  },
  mutations: {
    setIsAuthorized(state, value) {
      state.isAuthorized = value
    },
    setIsModalOpen(state, isOpen) {
      state.isModalOpen = isOpen
    },
  },
  getters: {
    isAuthorized: (state) => state.isAuthorized,
    isModalOpen: (state) => state.isModalOpen,
  },
  actions: {
    async startSearch({ dispatch }) {
      await dispatch('profiles/getTargetIds')
      await dispatch('content/getLikedContent')
    },
  },
  modules: {
    content,
    profiles,
    settingsFilter,
  },
})
