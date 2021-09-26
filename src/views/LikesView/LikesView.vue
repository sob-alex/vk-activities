<template>
  <div class="likes-view">
    <h1 class="likes-view__header text-h4">Поиск по лайкам</h1>
    <div class="text--secondary text-body-1 mt-3">
      Ищутся лайки пользователя в группах и на страницах пользователей
    </div>

    <v-row class="mt-2">
      <v-col class="settings" lg="4" cols="12">
        <SettingsPanel />
        <v-btn
          class="mt-4"
          depressed
          color="primary"
          block
          :disabled="!settingsFilters.valid"
          @click="searchAction"
          >{{ isSearching ? 'Стоп' : 'Поиск' }}</v-btn
        >
      </v-col>
      <v-col lg="8" cols="12">
        <v-tabs
          background-color="transparent"
          class="likes-view__tabs"
          v-model="tab"
          :show-arrows="$vuetify.breakpoint.xs"
        >
          <v-tab
            v-for="item in resultTabs"
            :key="item.key"
            :disabled="item.disabled"
            ><v-badge
              color="accent"
              :value="item.badgeCount"
              :content="item.badgeCount"
            >
              {{ item.key }}
            </v-badge>
          </v-tab>
        </v-tabs>
        <div v-if="isSearching">
          <v-progress-linear
            class="mt-2"
            color="light-blue"
            height="10"
            :value="progress * 100"
            striped
          ></v-progress-linear>
          <div class="text-right">Поиск: {{ currentItem }}</div>
        </div>
        <div v-show="tab === 0" class="wall">
          <PostCard
            v-for="post in likedPosts"
            :identificator="`${post.owner_id}_${post.id}`"
            :key="post.id"
            :name="post.name"
            :date="post.date"
            :postText="post.text"
            :likesCount="post.likes.count"
            :repostsCount="post.reposts.count"
            :commentsCount="post.comments.count"
            :isRepost="Boolean(post.copy_history)"
            :viewsCount="post.views.count"
            :postAttachments="extractAttachs(post.attachments)"
          />
        </div>
        <div v-show="tab === 1" class="photos">
          <PhotoCardsLayout>
            <v-col
              cols="6"
              sm="4"
              v-for="photo in likedPhotos"
              :key="photo.id"
            >
              <PhotoCard
                :identificator="`${photo.owner_id}_${photo.id}`"
                :name="photo.name"
                :date="photo.date"
                :postText="photo.text"
                :likesCount="photo.likes.count"
                :repostsCount="photo.reposts.count"
                :photoUrL="extractImageUrlFromSizes(photo.sizes).url"
              />
            </v-col>
          </PhotoCardsLayout>
        </div>
        <div v-show="tab === 2" class="comments">
          <CommentCard
            v-for="comment in likedComments"
            :identificator="`${comment.owner_id}_${comment.post_id}?reply=${comment.id}`"
            :key="comment.id"
            :from_id="comment.from_id"
            :date="comment.date"
            :commentText="comment.text"
            :likesCount="comment.likes.count"
            :threadCommentsCount="comment.thread.count"
            :hasAttachments="Boolean(comment.attachments)"
          />
        </div>
      </v-col>
    </v-row>
    <v-btn
      
      @click="$store.dispatch('content/setDummyData')"
      color='accent'
      class="test-button"
    >
      Тест
    </v-btn>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import PhotoCardsLayout from '../../components/PhotoCardsLayout.vue'
import PostCard from '../../components/PostCard.vue'
import PhotoCard from '../../components/PhotoCard.vue'
import CommentCard from '../../components/CommentCard.vue'
import SettingsPanel from './components/SettingsPanel/SettingsPanel.vue'
import {
  extractImagesFromAttachs,
  extractVideoInfoFromAttachs,
  extractImageUrlFromSizes,
} from '../../utils/utils'

const LIKES_CONTENT_TYPES = {
  WALL: 'Стена',
  PHOTOS: 'Фото в альбоме',
  COMMENTS: 'Комментарии',
}

export default Vue.extend({
  name: 'Home',
  data: () => ({
    tab: 0,
    resultTabs: [],
  }),
  components: {
    PostCard,
    SettingsPanel,
    PhotoCard,
    PhotoCardsLayout,
    CommentCard,
  },
  computed: {
    ...mapGetters('content', [
      'likedPosts',
      'likedPhotos',
      'likedComments',
    ]),
    ...mapGetters(['isAuthorized']),
    ...mapGetters('profiles', ['groups']),
    ...mapGetters('content', [
      'progress',
      'currentItem',
      'isSearching',
    ]),
    ...mapGetters('settingsFilter', ['settingsFilters']),
    // resultTabs() {
    //   return Object.entries(LIKES_CONTENT_TYPES).map(
    //     ([key, value]) => ({
    //       key: value,
    //       badgeCount: this.chooseBadgeIndex(key),
    //       disabled:
    //         !this.settingsFilters.contentTypes[key.toLowerCase()],
    //     })
    //   )
    // },
  },
  methods: {
    ...mapActions('content', ['getLikedContent', 'stopSeatch']),
    ...mapActions('profiles', ['getTargetIds']),
    ...mapActions(['startSearch']),
    ...mapMutations(['setIsModalOpen']),

    extractAttachs(attachs) {
      const photos = attachs ? extractImagesFromAttachs(attachs) : []
      const videos = attachs
        ? extractVideoInfoFromAttachs(attachs)
        : []
      return [...photos, ...videos]
    },
    searchAction() {
      if (!this.isAuthorized) {
        this.setIsModalOpen(true)
        return
      }
      if (this.isSearching) {
        this.stopSeatch()
      } else {
        if (!this.settingsFilters.valid) {
          return
        }
        this.startSearch()
      }
    },
    calculateResultTabs() {
      console.log('calc')
      this.resultTabs = Object.entries(LIKES_CONTENT_TYPES).map(
        ([key, value]) => ({
          key: value,
          badgeCount: this.chooseBadgeIndex(value),
          disabled:
            !this.settingsFilters.contentTypes[key.toLowerCase()],
        })
      )
    },
    chooseBadgeIndex(key) {
      if (key === LIKES_CONTENT_TYPES.WALL)
        return this.likedPosts.length
      if (key === LIKES_CONTENT_TYPES.PHOTOS)
        return this.likedPhotos.length
      if (key === LIKES_CONTENT_TYPES.COMMENTS)
        return this.likedComments.length
    },
    extractImageUrlFromSizes,
  },
  watch: {
    settingsFilters(newVal, oldVal) {
      if (
        JSON.stringify(newVal.contentTypes) !==
        JSON.stringify(oldVal.contentTypes)
      ) {
        this.calculateResultTabs()
        const availableIndex = this.resultTabs.findIndex(
          ({ disabled }) => !disabled
        )
        this.tab = availableIndex
      }
    },
    likedPosts: 'calculateResultTabs',
    likedPhotos: 'calculateResultTabs',
    likedComments: 'calculateResultTabs',
  },
  created() {
    this.calculateResultTabs()
  },
})
</script>

<style lang="scss">
@import '../../scss/colors.scss';
// @import '~vuetify/src/styles/styles.sass';
.likes-view {
  &__header {
    margin-top: 10px;

    // @media (min-width: map-get($grid-breakpoints, 'lg')) {
    //    margin-top: 14px;
    // }
  }
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
.test-button {
  position: fixed;
  bottom: 50px;
  right: 10px;
}
</style>
