<template>
  <v-app>
    <Header />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <v-footer app> FOOOTER </v-footer>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Header from './components/Header.vue'
export default Vue.extend({
  name: 'App',
  components: {
    Header,
  },

  data: () => ({
    //
  }),
})
</script>

<style lang="scss">
@import './scss/overrides.sass';
@import './scss/colors.scss';
#app {
  background-color: var(--v-background-base);
}
</style>
