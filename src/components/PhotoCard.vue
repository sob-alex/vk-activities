<template>
  <transition appear name="fade">
    <div class="photo-card">
      <v-sheet color="white" elevation="2" rounded>
        <v-img height="200px" :lazy-src="photoUrL" :src="photoUrL">
          <div
            class="
              d-flex
              flex-column
              justify-space-between
              fill-height
              pa-2
            "
          >
            <div class="d-flex justify-space-between">
              <div class="text-subtitle-2 white--text">
                {{ name }}
              </div>
              <v-btn
                class=""
                :href="link"
                target="_blank"
                color="white"
                icon
                small
              >
                <v-icon class="mr-1">mdi-open-in-new </v-icon>
              </v-btn>
            </div>
            <div class="info-container">
              <v-icon color="accent" class="mr-1"> mdi-heart </v-icon>
              <span class="subheading mr-2">{{ likesCount }}</span>
              <v-icon color="accent" class="mr-1">
                mdi-share-variant
              </v-icon>
              <span class="subheading mr-2">{{ repostsCount }}</span>
              <div class="subheading mr-2">
                {{ formatDate(date) }}
              </div>
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
      </v-sheet>
    </div>
  </transition>
</template>

<script>
import { formatDate } from '../utils/utils'
export default {
  name: 'PhotoCard',
  props: {
    postText: String,
    likesCount: Number,
    repostsCount: Number,
    photoUrL: String,
    date: Number,
    name: String,
    identificator: String,
  },
  computed: {
    link() {
      return `https://vk.com/photo${this.identificator}`
    },
  },
  methods: {
    formatDate,
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/transitions.scss';
.info-container {
  color: #fafafa;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.534);
  .v-icon {
    color: #ee3f3f;
  }
}

</style>
