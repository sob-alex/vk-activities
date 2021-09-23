<template>
  <v-dialog :value="isModalOpen" width="500">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Необходима авторизация
      </v-card-title>

      <v-card-text class="pt-4">
        Требуется авторизация ВКонтакте для продолжения работы с
        приложением, для получения API-ключа
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :href="authLink" color="primary" text>
          Авторизоваться
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { AUTH_LINK } from '../constants/constants'

export default {
  name: 'Dialog',
  data() {
    return {
      authLink: AUTH_LINK,
    }
  },
  computed: {
    ...mapGetters(['isModalOpen']),
  },
}
</script>

<style></style>
