import API from '../api'
import { CONTENT_TYPE } from '../constants/constants'
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
    isLoading: false,
    isSearching: false,
    error: null,
    progress: 0,
    currentItem: null,
    likedPosts: [],
    likedComments: [],
    likedPhotos: [],
  },
  getters: {
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    likedPosts: (state) => state.likedPosts,
    likedComments: (state) => state.likedComments,
    likedPhotos: (state) => state.likedPhotos,
    progress: (state) => state.progress,
    currentItem: (state) => state.currentItem,
    isSearching: (state) => state.isSearching,
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
      commit('profiles/setUsers', [], {root: true})
      commit('profiles/setGroups', [], {root: true})
    },
    async getLikedContent({
      commit,
      getters,
      dispatch,
      rootGetters,
    }) {
      commit('setIsSearching', true)
      commit('setLikedPhotos',[])
      commit('setLikedComments',[])
      commit('setLikedPosts',[])
      const users = rootGetters['profiles/users']
      let groups = rootGetters['profiles/groups']
      const {
        contentTypes,
        userId,
        searchDepth: { selected: depthOfSearch },
      } = rootGetters['settingsFilter/settingsFilters']
      console.log(contentTypes)
      groups = groups.map((group) => makeFieldNegative(group, 'id'))

      const targets = mixUpWithOrder(users, groups)
      const countOfWork =
        contentTypes.wall && contentTypes.photos
          ? targets.length * 2
          : targets.length
      let analyzedCount = 0
      if (contentTypes.wall || contentTypes.comments) {
        for (const { id, first_name, last_name, name } of targets) {
          const data = await fetchAction(commit, {
            apiMethod: API.wall.getPosts,
            params: { owner_id: id, count: depthOfSearch },
          })
          if (data.items) {
            const targetName =
              id > 0 ? `${first_name} ${last_name}` : name
            console.log(targetName)
            commit('setCurrentItem', targetName)
            const postsWithOwnerNames = data.items.map((post) => ({
              ...post,
              name: targetName,
            }))
            for (const post of postsWithOwnerNames) {
              if(!getters.isSearching) return;
              if (contentTypes.wall) {
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
                  commit('setLikedPosts', [
                    ...getters.likedPosts,
                    post,
                  ])
                }
                await sleep(220)
              }
              if (contentTypes.comments) {
                const dataComments = await fetchAction(commit, {
                  apiMethod: API.wall.getComments,
                  params: {
                    owner_id: post.owner_id,
                    post_id: post.id,
                    count: depthOfSearch,
                  },
                })
                if (dataComments.items) {
                  for (const comment of dataComments.items) {
                    if(!getters.isSearching) return;
                    const { liked } = await fetchAction(commit, {
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
                    await sleep(250)
                  }
                }
              }
            }
          }
          analyzedCount++
          commit('setProgress', analyzedCount / countOfWork)
        }
      }
      if (contentTypes.photos) {
        for (const { id, first_name, last_name, name } of targets) {
          if(!getters.isSearching) return;
          const data = await fetchAction(commit, {
            apiMethod: API.photos.getAllPhotos,
            params: { owner_id: id, count: depthOfSearch },
          })

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
              if(!getters.isSearching) return;
              const { liked } = await fetchAction(commit, {
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
              await sleep(220)
            }
          }
          if (contentTypes.comments) {
            const data = await fetchAction(commit, {
              apiMethod: API.photos.getAllComments,
              params: { owner_id: id, count: depthOfSearch },
            })
            if (data.items) {
              for (const comment of data.items) {
                if(!getters.isSearching) return;
                const { liked } = await fetchAction(commit, {
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
                await sleep(220)
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
