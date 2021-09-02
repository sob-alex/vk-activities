<template>
  <v-app-bar class="app-bar" app dark>
    <v-btn class="app-bar__button" plain>
      <router-link class="app-bar__link" to="/"
        >Поиск по лайкам</router-link
      >
    </v-btn>
    <v-btn class="app-bar__button" plain>
      <router-link class="app-bar__link" to="/comments"
        >Поиск по комментам</router-link
      >
    </v-btn>
    <v-spacer></v-spacer>
    <v-divider inset vertical></v-divider>
    <v-btn
      href="https://github.com/vuetifyjs/vuetify/releases/latest"
      target="_blank"
      text
    >
      <span class="mr-2">Login</span>
      <v-icon>mdi-login</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Header',
})
</script>

<style lang="scss">
@import '../scss/colors.scss';
.app-bar {
  background-color: var(--v-primary-base) !important;
  &__link {
    color: var(--v-onPrimary-base) !important;
    text-decoration: none;
  }
}
</style>
