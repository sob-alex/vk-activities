import API from '../api'
import {
  GROUP_SERACH_PLACES,
  USER_SERACH_PLACES,
} from '../constants/constants'
import {
  fetchAction,
  substract,
  transformUserIdentifier,
} from '../utils/utils'

const profileModule = {
  namespaced: true,
  state: {
    groups: [],
    users: [],
  },
  getters: {
    error: (state) => state.error,
    groups: (state) => state.groups,
    users: (state) => state.users,
  },
  mutations: {
    setGroups(state, groups) {
      state.groups = groups
    },
    setUsers(state, users) {
      state.users = users
    },
  },
  actions: {
    async getTargetIds({ commit, getters, rootGetters }) {
      const settings = rootGetters['settingsFilter/settingsFilters']
      let {
        userId: user_id,
        whereSearch: { userPages, groupPages },
        whereSearchInUsers: {
          selected: selectedUsersItems,
          specifiedProfiles,
        },
        whereSearchInGroups: {
          selected: selectedGroupsItems,
          specifiedGroups,
        },
      } = settings
      let profiles = []
      let groups = []

      if (specifiedProfiles.length) {
        profiles = await fetchAction({
          apiMethod: API.users.getUsersInfo,
          params: { user_ids: specifiedProfiles.join() },
        })
      }
      if (specifiedGroups.length) {
        groups = await fetchAction({
          apiMethod: API.groups.getGroupsInfo,
          params: { group_ids: specifiedGroups.join() },
        })
      }
      commit('setUsers', [...profiles])
      commit('setGroups', [...groups])

      user_id = transformUserIdentifier(user_id)

      if (isNaN(Number(user_id))) {
        const { object_id } = await fetchAction({
          apiMethod: API.users.resolveName,
          params: { screen_name: user_id },
        })
        user_id = object_id
      }

      commit('settingsFilter/setUserId', user_id, { root: true })

      if (userPages) {
        if (selectedUsersItems.includes(USER_SERACH_PLACES.FRIENDS)) {
          const { items: userIds } = await fetchAction({
            apiMethod: API.friends.getUserFriends,
            params: { user_id },
          })
          commit('setUsers', [...getters.users, ...userIds])
        }
        if (
          selectedUsersItems.includes(USER_SERACH_PLACES.SUBSCRIBERS)
        ) {
          const { items: userIds } = await fetchAction({
            apiMethod: API.friends.getUserFollowers,
            params: { user_id },
          })
          commit('setUsers', [...getters.users, ...userIds])
        }
      }
      if (groupPages) {
        if (
          selectedGroupsItems.includes(
            GROUP_SERACH_PLACES.USER_GROUPS
          )
        ) {
          const { items: groups } = await fetchAction({
            apiMethod: API.groups.getUserGroups,
            params: { user_id },
          })
          const { items: subscriptions } = await fetchAction({
            apiMethod: API.users.getSubscriptions,
            params: { user_id },
          })
          const subsWithoutUserPages = subscriptions.filter(
            (sub) => sub.type == 'page'
          )
          const groupsWithoutPages = substract(
            groups,
            subsWithoutUserPages,
            'id'
          )
          const resultGroups = [
            ...subsWithoutUserPages,
            ...groupsWithoutPages,
          ]

          commit('setGroups', [...getters.groups, ...resultGroups])
        }
      }
    },
  },
}

export default profileModule
