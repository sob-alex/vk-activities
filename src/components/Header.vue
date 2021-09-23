<template>
  <v-app-bar class="app-bar" color="primary" app dark>
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
    <v-btn v-if="!isAuthorized" :href="authLink" text>
      <span class="mr-2">Войти ВК</span>
      <v-icon>mdi-login</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { AUTH_LINK } from '../constants/constants'

export default Vue.extend({
  name: 'Header',
  data() {
    return {
      authLink: AUTH_LINK,
    }
  },
  computed: {
    ...mapGetters(['isAuthorized']),
  },
})
</script>

<style lang="scss">
@import '../scss/colors.scss';
.app-bar {
  &__link {
    color: var(--v-onPrimary-base) !important;
    text-decoration: none;
  }
}
</style>
