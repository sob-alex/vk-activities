<template>
  <div>
    <v-app-bar class="app-bar" color="primary" app dark>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-btn
        v-if="$vuetify.breakpoint.mdAndUp"
        class="app-bar__button mr-4"
        plain
      >
        <router-link class="app-bar__link" to="/"
          >Поиск по лайкам</router-link
        >
      </v-btn>
      <v-btn
        v-if="$vuetify.breakpoint.mdAndUp"
        class="app-bar__button"
        plain
      >
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
    <v-navigation-drawer
      class="drawer"
      v-model="drawer"
      absolute
      temporary
    >
      <v-list nav dense>
        <v-list-item-group
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <router-link to="/">Поиск по лайкам</router-link>
          </v-list-item>

          <v-list-item>
            <router-link to="/comments"
              >Поиск по комментам</router-link
            >
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
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
      drawer: false,
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
  &__button.v-btn:not(.v-btn--round).v-size--default {
    height: auto;
    padding: 0;
  }
  &__link {
    padding: 10px 5px;
    color: var(--v-onPrimary-base) !important;
    text-decoration: none;
  }
}
.drawer {
  .v-list .v-list-item {
    padding: 0;
    height: auto;
    min-height: auto;
    a {
      width: 100%;
      line-height: 2.8rem;
      padding-left: 4px;
      text-decoration: none;
    }
  }
}
</style>
