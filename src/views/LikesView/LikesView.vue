<template>
  <div class="likes-view">
    <h1 class="text-h4 mt-7">Поиск по лайкам</h1>
    <div class="text--secondary text-body-1 mt-3">
      Ищутся лайки пользователя в группах и на страницах пользователей
    </div>

    <v-row class="mt-2">
      <v-col class="settings" cols="4">
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
      <v-col cols="8">
        <v-tabs
          background-color="transparent"
          class="likes-view__tabs"
          v-model="tab"
        >
          <v-tab
            v-for="item in resultTabs"
            :key="item.key"
            :disabled="item.disabled"
            >{{ item.key }}</v-tab
          >
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
            :viewsCount="post.views.count"
            :postAttachments="extractAttachs(post.attachments)"
          />
        </div>
        <div v-show="tab === 1" class="photos">
          <PhotoCardsLayout>
            <v-col
              cols="4"
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
      style="position: fixed; bottom: 50px; right: 10px"
    >
      Dummy Data
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
  GROUP_SERACH_PLACES,
  USER_SERACH_PLACES,
} from '../../constants/constants.js'
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
    ...mapGetters('profiles', ['groups']),
    ...mapGetters('content', [
      'progress',
      'currentItem',
      'isSearching',
    ]),
    ...mapGetters('settingsFilter', ['settingsFilters']),
    resultTabs() {
      return Object.entries(LIKES_CONTENT_TYPES).map(
        ([key, value]) => ({
          key: value,
          disabled:
            !this.settingsFilters.contentTypes[key.toLowerCase()],
        })
      )
    },
  },
  methods: {
    ...mapActions('content', ['getLikedContent', 'stopSeatch']),
    ...mapActions('profiles', ['getTargetIds']),
    ...mapActions(['startSearch']),
    search() {
      if (!this.settingsFilters.valid) {
        return
      }
      this.startSearch()
    },
    extractAttachs(attachs) {
      const photos = attachs ? extractImagesFromAttachs(attachs) : []
      const videos = attachs
        ? extractVideoInfoFromAttachs(attachs)
        : []
      return [...photos, ...videos]
    },
    searchAction() {
      if (this.isSearching) {
        this.stopSeatch()
      } else {
        if (!this.settingsFilters.valid) {
          return
        }
        this.search()
      }
    },
    extractImageUrlFromSizes,
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
