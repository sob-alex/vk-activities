import API from '../api'
import {
  GROUP_SERACH_PLACES,
  USER_SERACH_PLACES,
} from '../constants/constants'
import { fetchAction } from '../utils/utils'

const profileModule = {
  namespaced: true,
  state: {
    isLoading: false,
    error: null,
    groups: [],
    users: [],
    
  },
  getters: {
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    groups: (state) => state.groups,
    users: (state) => state.users,
  },
  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setError(state, error) {
      state.error = error
    },
    setGroups(state, groups) {
      state.groups = groups
    },
    setUsers(state, users) {
      state.users = users
    },
  },
  actions: {
    async fetchGroups({ commit }, { user_id }) {
      console.log('before')
      await fetch(commit, {
        apiMethod: API.groups.getUserGroups,
        params: { user_id },
        commitType: 'setGroups',
      })
      console.log('after')
    },

    async getTargetIds(
      { commit, getters },
      {
        user_id,
        whereSearch: { userPages, groupPages },
        usersSelectedOptions: {
          selected: selectedUsersItems,
          specifiedProfiles,
        },
        groupsSelectedOptions: {
          selected: selectedGroupsItems,
          specifiedGroups,
        },
      }
    ) {
      commit('setUsers', [...specifiedProfiles])
      commit('setUsers', [...specifiedGroups])
      if (userPages) {
        if (selectedUsersItems.includes(USER_SERACH_PLACES.FRIENDS)) {
          commit('setIsLoading', true)
          const userIds = await fetchAction(commit, {
            apiMethod: API.friends.getUserFriends,
            params: { user_id },
          })
          commit('setUsers', [...getters.users, ...userIds])
          commit('setIsLoading', false)
        }
        if (
          selectedUsersItems.includes(USER_SERACH_PLACES.SUBSCRIBERS)
        ) {
          commit('setIsLoading', true)
          const userIds = await fetchAction(commit, {
            apiMethod: API.friends.getUserFollowers,
            params: { user_id },
          })
          commit('setUsers', [...getters.users, ...userIds])
          commit('setIsLoading', false)
        }
      }
      if (groupPages) {
        if (
          selectedGroupsItems.includes(
            GROUP_SERACH_PLACES.USER_GROUPS
          )
        ) {
          commit('setIsLoading', true)
          const groupIds = await fetchAction(commit, {
            apiMethod: API.groups.getUserGroups,
            params: { user_id },
          })
          commit('setGroups', [...getters.groups, ...groupIds])
          commit('setIsLoading', false)
        }
      }
    },
  },
}

export default profileModule
