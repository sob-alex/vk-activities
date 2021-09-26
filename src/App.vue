<template>
  <v-app>
    <Header />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <v-footer app class="text--secondary"> © Алексей Соболев </v-footer>
    <Dialog />
    <Snackbar/>
  </v-app>
</template>

<script>
import Vue from 'vue'

import { mapGetters, mapActions, mapMutations } from 'vuex'
import Dialog from './components/Dialog.vue'
import Header from './components/Header.vue'
import Snackbar from './components/Snackbar.vue'
import { getToken } from './utils/utils'
import { refreshToken } from './plugins/axios'
export default Vue.extend({
  name: 'App',
  components: {
    Header,
    Dialog,
    Snackbar
  },
  methods: {
    ...mapMutations(['setIsAuthorized']),
  },
  watch:{
    '$vuetify.breakpoint.name'(){
     
      console.log( this.$vuetify.breakpoint.name)
    }
  },
  created() {
    if (this.$route.hash) {
      localStorage.setItem('api-key', getToken(this.$route.hash))
      refreshToken()
      this.setIsAuthorized(true)
      history.replaceState(
        '',
        document.title,
        window.location.pathname
      )
    }
  },
})
</script>

<style lang="scss">
@import './scss/overrides.sass';
@import './scss/colors.scss';
#app {
  background-color: var(--v-background-base);
}
</style>
