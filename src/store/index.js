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
    snackbarMessage: null,
    error: null,
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    setSnackbarMessage(state, message) {
      state.snackbarMessage = message
    },
    setIsAuthorized(state, value) {
      state.isAuthorized = value
    },
    setIsModalOpen(state, isOpen) {
      state.isModalOpen = isOpen
    },
  },
  getters: {
    error: (state) => state.error,
    isAuthorized: (state) => state.isAuthorized,
    snackbarMessage: (state) => state.snackbarMessage,
    isModalOpen: (state) => state.isModalOpen,
  },
  actions: {
    async startSearch({ dispatch }) {
      await dispatch('profiles/getTargetIds')
      await dispatch('content/getLikedContent')
    },
    setError({ commit }, error) {
      commit('setError', error)
      commit('setSnackbarMessage', error)
    },
  },
  modules: {
    content,
    profiles,
    settingsFilter,
  },
})
