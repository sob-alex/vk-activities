import API from '../api'
import { CONTENT_TYPE } from '../constants/constants'
import {
  fetchAction,
  makeFieldNegative,
  mixUpWithOrder,
  sleep,
} from '../utils/utils'

const contentModule = {
  namespaced: true,
  state: {
    isLoading: false,
    error: null,
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
      let groups = rootGetters['profiles/groups']
      const {
        contentTypes,
        userId,
        searchDepth: { selected: depthOfSearch },
      } = rootGetters['settingsFilter/settingsFilters']
      console.log(contentTypes)
      groups = groups.map((group) => makeFieldNegative(group, 'id'))

      const targets = mixUpWithOrder(users, groups)
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
            const postsWithOwnerNames = data.items.map((post) => ({
              ...post,
              name: targetName,
            }))
            for (const post of postsWithOwnerNames) {
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
                await sleep(230)
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
                    await sleep(230)
                  }
                }
              }
            }
          }
        }
      }
      if (contentTypes.photos) {
        for (const { id, first_name, last_name, name } of targets) {
          const data = await fetchAction(commit, {
            apiMethod: API.photos.getAllPhotos,
            params: { owner_id: id, count: depthOfSearch },
          })

          if (data.items) {
            for (const photo of data.items) {
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
              await sleep(230)
            }
          }
          if (contentTypes.comments) {
            const data = await fetchAction(commit, {
              apiMethod: API.photos.getAllComments,
              params: { owner_id: id, count: depthOfSearch },
            })
            if (data.items) {
              for (const comment of data.items) {
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
                await sleep(230)
              }
            }
          }
        }
      }
    },
  },
}

export default contentModule
