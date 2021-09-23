import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.blue.darken1,
        onPrimary: '#fff',
        background: '#f7faff',
      },
    },
    options: { customProperties: true },
  },
  breakpoint: {
    thresholds: {
      xs: 490,
      sm: 800,
      md: 1000,
      lg: 1280,
    }, 
  },
})
