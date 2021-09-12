<template>
  <div class="psot-card">
    <v-card max-width="700" class="mx-auto my-2">
      <v-card-title class="text-h5">{{name}}</v-card-title>

      <v-card-text>
        <div class="text-body-2">
          {{ postText }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-icon class="mr-1"> mdi-heart </v-icon>
        <span class="subheading mr-2">{{ likesCount }}</span>
        <v-icon class="mr-1"> mdi-share-variant </v-icon>
        <span class="subheading">{{ repostsCount }}</span>
        <v-spacer></v-spacer>
        <v-btn color="deep-purple lighten-2" text> Open </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'PostCard',
  props: {
    postText: String,
    likesCount: Number,
    repostsCount: Number,
    name: String
  },
}
</script>

<style lang="scss" scoped></style>
