<template>
  <transition appear name="fade">
    <div class="post-card">
      <v-card class="mx-auto my-2">
        <div class="d-flex justify-space-between">
          <v-card-title class="text-h5">{{ name }}</v-card-title>
          <v-btn
            class="mr-2 mt-3"
            :href="link"
            target="_blank"
            color="deep-purple lighten-2"
            text
            small
          >
            Открыть
          </v-btn>
        </div>

        <v-card-text>
          <div class="text-body-2">
            <div v-if="isRepost" class="mb-2">
              <v-icon>mdi-share-outline</v-icon>Запись с другого
              источника
            </div>
            <div>
              {{ postText }}
            </div>
          </div>
        </v-card-text>
        <v-carousel
          v-if="postAttachments.length"
          :hide-delimiters="isOneAttach"
          :show-arrows="!isOneAttach"
          :height="carouselHeight"
        >
          <v-carousel-item
            v-for="media in postAttachments"
            :key="media.imgUrl"
          >
            <v-img
              contain
              max-height="100%"
              :lazy-src="media.imgUrl"
              :src="media.imgUrl"
            >
              <div v-if="media.title" class="pl-4 pt-2">
                <div class="image-title">
                  Видео: {{ media.title }}
                </div>
              </div>
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row> </template
            ></v-img>
          </v-carousel-item>
        </v-carousel>

        <v-card-actions class="flex-column flex-sm-row">
          <div>
            <v-icon class="mr-1"> mdi-heart </v-icon>
            <span class="subheading mr-2">{{ likesCount }}</span>
            <v-icon class="mr-1"> mdi-share-variant </v-icon>
            <span class="subheading mr-2">{{ repostsCount }}</span>
            <v-icon class="mr-1"> mdi-comment </v-icon>
            <span class="subheading mr-6">{{ commentsCount }}</span>
            <v-icon class="mr-1"> mdi-eye </v-icon>
            <span class="subheading mr-2">{{ viewsCount }}</span>
          </div>

          <v-spacer></v-spacer>
          <span class="subheading mr-2">{{ formatDate(date) }}</span>
        </v-card-actions>
      </v-card>
    </div>
  </transition>
</template>

<script>
import { formatDate } from '../utils/utils'

export default {
  name: 'PostCard',
  props: {
    postText: String,
    likesCount: Number,
    repostsCount: Number,
    commentsCount: Number,
    viewsCount: Number,
    date: Number,
    name: String,
    isRepost: Boolean,
    postAttachments: Array,
    identificator: String,
  },
  computed: {
    isOneAttach() {
      return this.postAttachments.length === 1
    },
    link() {
      return `https://vk.com/wall${this.identificator}`
    },
    carouselHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 200
        case 'sm':
          return 250
        case 'md':
          return 300
        case 'lg':
          return 400
        case 'xl':
          return 450
      }
    },
  },
  created() {
    console.log('creted')
  },
  methods: {
    formatDate,
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/transitions.scss';
.v-card__title {
  padding: 16px 16px 0px;
}
.image-title {
  color: white;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgb(0, 0, 0);
}
</style>
