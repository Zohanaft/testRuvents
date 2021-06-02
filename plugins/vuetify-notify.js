import Vue from 'vue'
import VuetifyNotify from 'vuetify-notify'

export default ({ app }, inject) => {
  window.onNuxtReady(() => {
    Vue.use(VuetifyNotify, {
      vuetify: app.vuetify,
      container: '__nuxt',
      options: {
        toast: {
          color: 'success',
          timeout: 4000,
          x: 'right',
          y: 'top',
          width: 300
        }
      }
    })
  })
}
