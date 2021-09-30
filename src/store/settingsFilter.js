import {
  CONTENT_TYPE,
  GROUP_SERACH_PLACES,
  USER_SERACH_PLACES,
} from '../constants/constants'

const settingsFilter = {
  namespaced: true,
  state: {
    isLoading: false,
    error: null,
    settingsFilters: {
      valid: false,
      userId: '',
      contentTypes: {
        wall: true,
        photos: true,
        comments: false,
      },
      whereSearch: {
        userPages: true,
        groupPages: true,
      },
      whereSearchInUsers: {
        selected: [USER_SERACH_PLACES.FRIENDS],
        items: [...Object.values(USER_SERACH_PLACES)],
        specifiedProfiles: [],
      },
      whereSearchInGroups: {
        selected: [GROUP_SERACH_PLACES.USER_GROUPS],
        items: [...Object.values(GROUP_SERACH_PLACES)],
        specifiedGroups: [],
      },
      searchDepth: {
        selected: 10,
        items: [10, 50, 100],
      },
    },
  },
  getters: {
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    settingsFilters: (state) => state.settingsFilters,
  },
  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setSettingsFilters(state, settings) {
      state.settingsFilters = settings
    },
    setUserId(state, userId) {
      state.settingsFilters.userId = userId
    },
  },
  actions: {},
}

export default settingsFilter
