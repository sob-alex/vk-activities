<template>
  <transition appear name="fade">
    <div class="comment-card">
      <v-card class="mx-auto my-2">
        <div class="d-flex justify-space-between">
          <v-card-title class="text-h5">id{{ from_id }}</v-card-title>
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
            {{ commentText }}
            <div class="text-subtitle-2 mt-2" v-if="hasAttachments">
              <v-icon> mdi-animation-outline</v-icon> Содержит медиа
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-icon class="mr-1"> mdi-heart </v-icon>
          <span class="subheading mr-2">{{ likesCount }}</span>
          <v-icon class="mr-1">mdi-comment-text-multiple </v-icon>
          <span class="subheading mr-6">{{
            threadCommentsCount
          }}</span>
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
  name: 'CommentCard',
  props: {
    commentText: String,
    likesCount: Number,
    threadCommentsCount: Number,
    date: Number,
    from_id: Number,
    hasAttachments: Boolean,
    identificator: String,
  },
  computed: {
    link() {
      return `https://vk.com/wall${this.identificator}`
    },
  },
  methods: {
    formatDate,
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/transitions.scss';
</style>
