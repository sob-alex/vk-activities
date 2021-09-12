<template>
  <div class="likes-view">
    <h1 class="text-h4 mt-7">Поиск по лайкам</h1>
    <div class="text--secondary text-body-1 mt-3">
      Ищутся лайки пользователя в группах и на страницах пользователей
    </div>

    <v-row class="mt-2">
      <v-col class="settings" cols="4">
        <SettingsPanel v-model="settingsFilters" />
        <v-btn
          class="mt-4"
          depressed
          color="primary"
          block
          :disabled="!settingsFilters.valid"
          @click="search"
          >Поиск</v-btn
        >
      </v-col>
      <v-col cols="8">
        <v-tabs
          background-color="transparent"
          class="likes-view__tabs"
          v-model="tab"
        >
          <v-tab v-for="item in resultTabs" :key="item">{{
            item
          }}</v-tab>
        </v-tabs>
        <div v-if="tab === 0" class="wall">
          wall
          <PostCard
            v-for="post in likedPosts"
            :key="post.id"
            :name="post.name"
            :postText="post.text"
            :likesCount="post.likes.count"
            :repostsCount="post.reposts.count"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import PostCard from '../../components/PostCard.vue'
import SettingsPanel from './components/SettingsPanel/SettingsPanel.vue'
import {
  GROUP_SERACH_PLACES,
  USER_SERACH_PLACES,
} from '../../constants/constants.js'
const LIKES_CONTENT_TYPES = {
  WALL: 'Стена',
  PHOTOS: 'Фото в альбоме',
  COMMENTS: 'Комментарии',
}


export default Vue.extend({
  name: 'Home',
  data: () => ({
    tab: 0,
    settingsFilters: {
      valid: true,
      userId: '',
      contentTypes: {
        wall: true,
        photos: true,
        comments: true,
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
      searchDepth:{
        selected: 10,
        items: [10,50,100]
      }
    },
  }),
  components: {
    PostCard,
    SettingsPanel,
  },
  computed: {
    ...mapGetters('content', ['likedPosts']),
    ...mapGetters('profiles', ['groups']),
    resultTabs() {
      const result = []
      for (let type in LIKES_CONTENT_TYPES) {
        if (this.settingsFilters.contentTypes[type.toLowerCase()]) {
          result.push(LIKES_CONTENT_TYPES[type])
        }
      }
      return result
    },
  },
  methods: {
    ...mapActions('content', ['fetchPosts', 'getLikedContent']),
    ...mapActions('profiles', ['fetchGroups', 'getTargetIds']),
    async search() {
      if (!this.settingsFilters.valid) {
        return
      }
      await this.getTargetIds({
        user_id: this.settingsFilters.userId,
        whereSearch: this.settingsFilters.whereSearch,
        usersSelectedOptions: this.settingsFilters.whereSearchInUsers,
        groupsSelectedOptions:
          this.settingsFilters.whereSearchInGroups,
      })
      await this.getLikedContent({
        options: this.settingsFilters.contentTypes,
        userId: this.settingsFilters.userId,
      })
    },
  },
  created() {},
})
</script>

<style lang="scss">
@import '../../scss/colors.scss';
.likes-view {
  &__tabs {
    border-bottom: 1px solid $border-color;
    // background-color: transparent !important;
  }
  &__settings {
    background-color: $main-color;
  }
}
.settings {
  &__search-btn {
    // color: $main-text-color-light !important;
    // background-color: $main-color !important;
  }
}
</style>
