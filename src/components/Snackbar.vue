<template>
  <v-snackbar :value="Boolean(snackbarMessage)" :timeout="-1">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Snackbar',
  data() {
    return {
      timer: null,
    }
  },
  computed: {
    ...mapGetters(['snackbarMessage']),
  },
  methods: {
    ...mapMutations(['setSnackbarMessage']),
  },
  watch: {
    snackbarMessage() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setSnackbarMessage('')
      }, 2000)
    },
  },
}
</script>

<style></style>
