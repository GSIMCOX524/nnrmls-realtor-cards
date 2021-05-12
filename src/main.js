import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'

Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')

console.log('%c BETA – IN DEVELOPMENT ', 'color: #ff0000')
console.log('%c NETLIFY ID: MODEST-PARE-DAD981 ', 'color: #ff0000')
