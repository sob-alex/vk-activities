import API from '../api'
import { CONTENT_TYPE, SEARCH_DELAY_MS } from '../constants/constants'
import {
  fetchAction,
  makeFieldNegative,
  mixUpWithOrder,
  sleep,
} from '../utils/utils'
import { fakePosts, fakePhotos, fakeComments } from './dummyData'

const contentModule = {
  namespaced: true,
  state: {
    isSearching: false,
    progress: 0,
    currentItem: null,
    likedPosts: [],
    likedComments: [],
    likedPhotos: [],
  },
  getters: {
    likedPosts: (state) => state.likedPosts,
    likedComments: (state) => state.likedComments,
    likedPhotos: (state) => state.likedPhotos,
    progress: (state) => state.progress,
    currentItem: (state) => state.currentItem,
    isSearching: (state) => state.isSearching,
  },
  mutations: {
    setLikedPosts(state, posts) {
      state.likedPosts = posts
    },
    setLikedComments(state, comments) {
      state.likedComments = comments
    },
    setLikedPhotos(state, photos) {
      state.likedPhotos = photos
    },
    setProgress(state, value) {
      state.progress = value
    },
    setCurrentItem(state, item) {
      state.currentItem = item
    },
    setIsSearching(state, isSearching) {
      state.isSearching = isSearching
    },
  },
  actions: {
    setDummyData({ commit, getters }) {
      commit('setLikedPosts', [...getters.likedPosts, ...fakePosts])
      commit('setLikedPhotos', [
        ...getters.likedPhotos,
        ...fakePhotos,
      ])
      commit('setLikedComments', [
        ...getters.likedComments,
        ...fakeComments,
      ])
    },
    stopSeatch({ commit }) {
      commit('setIsSearching', false)
      commit('setCurrentItem', null)
      commit('setProgress', 0)
      commit('profiles/setUsers', [], { root: true })
      commit('profiles/setGroups', [], { root: true })
    },
    async getLikesOnPostsOrComments(
      { rootGetters, getters, commit },
      posts
    ) {
      const {
        contentTypes,
        userId,
        searchDepth: { selected: depthOfSearch },
      } = rootGetters['settingsFilter/settingsFilters']

      for (const post of posts) {
        if (!getters.isSearching) return
        if (contentTypes.wall) {
          const { liked } = await fetchAction({
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
          await sleep(SEARCH_DELAY_MS)
        }
        if (contentTypes.comments) {
          const dataComments = await fetchAction({
            apiMethod: API.wall.getComments,
            params: {
              owner_id: post.owner_id,
              post_id: post.id,
              count: depthOfSearch,
            },
          })
          await sleep(SEARCH_DELAY_MS)
          if (dataComments.items) {
            for (const comment of dataComments.items) {
              if (!getters.isSearching) return
              const { liked } = await fetchAction({
                apiMethod: API.likes.getIsLiked,
                params: {
                  user_id: userId,
                  type: CONTENT_TYPE.COMMENT,
                  item_id: comment.id,
                  owner_id: comment.owner_id,
                },
              })
              if (liked) {
                commit('setLikedComments', [
                  ...getters.likedComments,
                  comment,
                ])
              }
              await sleep(SEARCH_DELAY_MS)
            }
          }
        }
      }
    },
    async getLikedContent({
      commit,
      getters,
      dispatch,
      rootGetters,
    }) {
      commit('setIsSearching', true)
      commit('setLikedPhotos', [])
      commit('setLikedComments', [])
      commit('setLikedPosts', [])
      const users = rootGetters['profiles/users']
      let groups = rootGetters['profiles/groups']
      const {
        contentTypes,
        userId,
        searchDepth: { selected: depthOfSearch },
      } = rootGetters['settingsFilter/settingsFilters']

      groups = groups.map((group) => makeFieldNegative(group, 'id'))

      const targets = mixUpWithOrder(users, groups)
      const countOfWork =
        contentTypes.wall && contentTypes.photos
          ? targets.length * 2
          : targets.length
      let analyzedCount = 0
      if (contentTypes.wall || contentTypes.comments) {
        for (const { id, first_name, last_name, name } of targets) {
          const data = await fetchAction({
            apiMethod: API.wall.getPosts,
            params: { owner_id: id, count: depthOfSearch },
          })
          await sleep(SEARCH_DELAY_MS)
          if (data.items) {
            const targetName =
              id > 0 ? `${first_name} ${last_name}` : name
            commit('setCurrentItem', targetName)
            const postsWithOwnerNames = data.items.map((post) => ({
              ...post,
              name: targetName,
            }))
            await dispatch(
              'getLikesOnPostsOrComments',
              postsWithOwnerNames
            )
            if (!getters.isSearching) return
          }
          analyzedCount++
          commit('setProgress', analyzedCount / countOfWork)
        }
      }
      if (contentTypes.photos) {
        for (const { id, first_name, last_name, name } of targets) {
          if (!getters.isSearching) return
          const data = await fetchAction({
            apiMethod: API.photos.getAllPhotos,
            params: { owner_id: id, count: depthOfSearch },
          })
          await sleep(SEARCH_DELAY_MS)
          if (data.items) {
            const targetName =
              id > 0 ? `${first_name} ${last_name}` : name
            console.log(targetName)
            commit('setCurrentItem', targetName)
            const photosWithOwnerNames = data.items.map((photo) => ({
              ...photo,
              name: targetName,
            }))
            for (const photo of photosWithOwnerNames) {
              if (!getters.isSearching) return
              const { liked } = await fetchAction({
                apiMethod: API.likes.getIsLiked,
                params: {
                  user_id: userId,
                  type: CONTENT_TYPE.PHOTO,
                  item_id: photo.id,
                  owner_id: photo.owner_id,
                },
              })
              if (liked) {
                commit('setLikedPhotos', [
                  ...getters.likedPhotos,
                  photo,
                ])
              }
              await sleep(SEARCH_DELAY_MS)
            }
          }

          if (contentTypes.comments) {
            const data = await fetchAction({
              apiMethod: API.photos.getAllComments,
              params: { owner_id: id, count: depthOfSearch },
            })
            await sleep(SEARCH_DELAY_MS)
            if (data.items) {
              for (const comment of data.items) {
                if (!getters.isSearching) return
                const { liked } = await fetchAction({
                  apiMethod: API.likes.getIsLiked,
                  params: {
                    user_id: userId,
                    type: CONTENT_TYPE.PHOTO_COMMENT,
                    item_id: comment.id,
                    owner_id: comment.owner_id,
                  },
                })
                if (liked) {
                  commit('setLikedComments', [
                    ...getters.likedComments,
                    comment,
                  ])
                }
                await sleep(SEARCH_DELAY_MS)
              }
            }
          }
          analyzedCount++
          commit('setProgress', analyzedCount / countOfWork)
        }
      }
      dispatch('stopSeatch')
    },
  },
}

export default contentModule
