import API from '../api'
import { CONTENT_TYPE } from '../constants/constants'
import { fetchAction, sleep } from '../utils/utils'

const contentModule = {
  namespaced: true,
  state: {
    isLoading: false,
    error: null,
    likedPosts: [],
    likedComments: [],
  },
  getters: {
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    likedPosts: (state) => state.likedPosts,
  },
  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setError(state, error) {
      state.error = error
    },
    setLikedPosts(state, posts) {
      state.likedPosts = posts
    },
  },
  actions: {
    async fetchPosts({ commit }, { owner_id }) {
      try {
        commit('setIsLoading', true)
        const {
          response: { items: posts },
          error,
        } = await API.wall.getPosts({ owner_id })
        if (error) {
          commit('setError', error.error_msg)
          return
        }
        commit('setPosts', posts)
        console.log(posts, error)
      } catch (e) {
        console.error(e)
      } finally {
        commit('setIsLoading', false)
      }
    },
    async getLikedContent({ commit, getters, rootGetters }) {
      const users = rootGetters['profiles/users']
      const groups = rootGetters['profiles/groups']
      const {
        contentTypes,
        userId,
        searchDepth: { selected: depthOfSearch },
      } = rootGetters['settingsFilter/settingsFilters']
      console.log(contentTypes)
      if (contentTypes.wall) {
        for (const { id, first_name, last_name } of users) {
          const data = await fetchAction(commit, {
            apiMethod: API.wall.getPosts,
            params: { owner_id: id, count: depthOfSearch },
          })
          if (data.items) {
            const postsWithOwnerNames = data.items.map((post) => ({
              ...post,
              name: `${first_name} ${last_name}`,
            }))
            for (const post of postsWithOwnerNames) {
              const { liked } = await fetchAction(commit, {
                apiMethod: API.likes.getIsLiked,
                params: {
                  user_id: userId,
                  type: CONTENT_TYPE.POST,
                  item_id: post.id,
                  owner_id: post.owner_id,
                },
              })
              if (liked) {
                commit('setLikedPosts', [...getters.likedPosts, post])
              }
              await sleep(200)
            }
          }
        }
      }
    },
  },
}

export default contentModule
