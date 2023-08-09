import './style.css'
import 'toastr/build/toastr.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import {createApp} from 'vue'
import store from './storages/vuex'
import router from './router/router'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons'

library.add(faCopyright)
library.add(faThumbsDown)
library.add(faThumbsUp)

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)

app.use(store)
app.use(router)

app.mount('#app')

