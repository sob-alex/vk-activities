import API from '../api'
import { CONTENT_TYPE } from '../constants/constants'
import { fetchAction, sleep } from '../utils/utils'

const wallModule = {
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
    posts: (state) => state.posts,
  },
  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setError(state, error) {
      state.error = error
    },
    setPosts(state, posts) {
      state.posts = posts
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
    async getLikedContent({ commit, rootGetters }, options, userId) {
      const users = rootGetters['profiles/users']
      const groups = rootGetters['profiles/groups']
      console.log(options)
      if (options.wall) {
        const posts = []

        for (const owner_id of users) {
          const { items: posts } = await fetchAction(commit, {
            apiMethod: API.wall.getPosts,
            params: { owner_id },
          })
          posts.push(...posts)
          await sleep(200)
        }
        for (const post of posts) {
          const { isLiked } = await fetchAction(commit, {
            apiMethod: API.likes.getIsLiked,
            params: {
              user_id: userId,
              type: CONTENT_TYPE.POST,
              item_id: post.id,
              owner_id: post.ownerr_id,
            },
          })
          posts.push(...posts)
          console.log(posts)
          await sleep(200)
        }
      }
    },
  },
}

export default wallModule
