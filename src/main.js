import { createApp } from 'vue'
import Homepage from './components/Homepage.vue'
import MovieCard from './components/MovieDetail.vue'
import MovieDetail from './components/MovieDetail.vue'
import { RouterLink, RouterView } from 'vue-router'
import { createStore } from 'vuex'
import VueDatepickerUi from 'vue-datepicker-ui'

import 'vue-datepicker-ui/lib/vuedatepickerui.css';
import 'bootstrap/dist/css/bootstrap-reboot.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import 'bootstrap/dist/css/bootstrap-utilities.css'
import './assets/base.css'

const store = createStore({
    state () {
        return {
            apiKey: "f62f750b70a8ef11dad44670cfb6aa57",
            movieGenresUrl: "https://api.themoviedb.org/3/genre/movie/list",
            movieListUrl: "https://api.themoviedb.org/3/discover/movie",
            movieDetailUrl: "https://api.themoviedb.org/3/movie/",
        }
    },
})

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(store)
app.use(router, Homepage, MovieCard, MovieDetail, RouterLink, RouterView)
app.component('Datepicker', VueDatepickerUi)

app.mount('#app')
