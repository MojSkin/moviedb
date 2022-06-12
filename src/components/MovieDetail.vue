<template>
    <div class="container">
        <div class="row rounded d-flex flex-row px-5 py-4 mb-5 justify-content-between align-items-center" style="border: solid 1px #CFCFCF; background: #E2E2E2; border-radius: 6px;">
            <div class="col-12 d-flex justify-content-start align-items-center">
                <router-link to="/" tag="button" class="btn btn-primary rounded-pill">
                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 5.33331L2.60929 5.33331L6.18529 1.75731C6.44562 1.49698 6.44562 1.07481 6.18546 0.814648C5.92512 0.554315 5.50279 0.554315 5.24246 0.814648L0.528624 5.52865C0.497623 5.55965 0.469958 5.59381 0.445625 5.63015C0.434459 5.64698 0.426624 5.66515 0.416958 5.68265C0.405957 5.70331 0.393291 5.72298 0.384458 5.74481C0.374958 5.76731 0.369625 5.79065 0.362958 5.81398C0.357458 5.83248 0.350291 5.85015 0.346458 5.86915C0.337791 5.91248 0.333291 5.95615 0.333291 5.99998C0.333291 6.00048 0.333458 6.00098 0.333458 6.00148C0.333624 6.04465 0.337958 6.08798 0.346458 6.13048C0.350458 6.15048 0.357958 6.16898 0.363791 6.18865C0.370291 6.21081 0.375291 6.23331 0.384291 6.25481C0.393958 6.27798 0.406958 6.29898 0.418958 6.32081C0.427958 6.33715 0.435123 6.35381 0.445457 6.36948C0.46979 6.40631 0.497791 6.44065 0.528958 6.47181L5.24263 11.1853C5.50296 11.4456 5.92512 11.4456 6.18546 11.1855C6.44579 10.9251 6.44579 10.503 6.18546 10.2425L2.60946 6.66665L13 6.66665C13.3681 6.66665 13.6666 6.36815 13.6666 5.99998C13.6666 5.63181 13.3681 5.33331 13 5.33331Z" fill="white"/>
                    </svg>
                    &nbsp;
                    <span>Back</span>
                </router-link>
                <div class="d-inline-block ms-3">
                    <div class="d-flex flex-column">
                        <span style="font-weight: bold">{{ movie.title }}</span>
                        <span>{{ movie.tagline }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-4 pl-0">
                <img class="cover-image" :src="'https://image.tmdb.org/t/p/w500'+movie.poster_path" alt="">
            </div>
            <div class="col-8">
                <table class="table table-responsive table-borderless">
                    <tr>
                        <td class="title">Budget</td>
                        <td class="detail">${{ (movie?.budget || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'") }}</td>
                    </tr>
                    <tr>
                        <td class="title">Revenue</td>
                        <td class="detail">${{ (movie?.revenue || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'") }}</td>
                    </tr>
                    <tr>
                        <td class="title">Release Date</td>
                        <td class="detail">{{ movie?.release_date }}</td>
                    </tr>
                    <tr>
                        <td class="title">Runtime</td>
                        <td class="detail">{{ humanReadableRuntime(movie?.runtime || 0) }}</td>
                    </tr>
                    <tr>
                        <td class="title">Score</td>
                        <td class="detail"><StarRating class="m-0 p-0" :max-rating="10" :inline="true" :star-size="12" :border-width="1" :round-start-rating="false" :rating="movie?.vote_average || 0" :read-only="true"></StarRating> ({{ movie?.vote_count }} votes)</td>
                    </tr>
                    <tr>
                        <td class="title">Genre</td>
                        <td class="detail"><span class="genres" v-for="genre in movie?.genres || []">{{ genre.name }}</span></td>
                    </tr>
                    <tr>
                        <td class="title">IMDB Link</td>
                        <td class="detail"><a :href="'https://www.imdb.com/title/'+movie?.imdb_id" target="_blank">Link</a></td>
                    </tr>
                    <tr>
                        <td class="title">Homepage Link</td>
                        <td class="detail"><a :href="movie?.homepage || '#'" target="_blank">Link</a></td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12 mb-4 ps-0">{{ movie?.overview }}</div>
            <div class="col-12 ps-0 mb-5">
                <h6 class="casts">Credit:</h6>
                <span>{{ creditsList }}</span>
                <span v-if="credits.length>10"> and {{ credits.length - 10 }} more</span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import StarRating from 'vue-star-rating'
export default {
    name: "MovieDetail",
    props: ['options'],
    components: {StarRating},
    data() {
        return {
            movie: {},
            credits: []
        }
    },
    created() {
        const url = this.$store.state.movieDetailUrl+this.$route.params?.id+'?api_key='+this.$store.state.apiKey+'&language=en-US'
        const castUrl = this.$store.state.movieDetailUrl+this.$route.params?.id+'/credits?api_key='+this.$store.state.apiKey+'&language=en-US'
        axios({
            method: 'get',
            url: url,
            headers: { }
        }).then(res => {
            this.movie = res?.data || {}
        }).catch(err => {
            console.error('Error loading movie detail:', err?.response?.status || 'Unknown error code', err?.response?.statusText || 'Unknown error message')
        })
        axios({
            method: 'get',
            url: castUrl,
            headers: { }
        }).then(res => {
            this.credits = res?.data?.cast || []
        }).catch(err => {
            console.error('Error loading movie casts:', err?.response?.status || 'Unknown error code', err?.response?.statusText || 'Unknown error message')
        }).then(res => {
            console.log(this.casts)
        })
    },
    mounted() {

    },
    computed: {
        creditsList() {
            let creditList = ''
            const maxLength = (this.credits.length > 10 ? 10 : this.credits.length)
            for (let i = 0; i < maxLength; i++) {
                creditList += this.credits[i].name
                if (i != maxLength-1) {
                    creditList += ', '
                }
            }
            return creditList
        }
    },
    methods: {
        humanReadableRuntime(totalMinutes) {
            const minutes = totalMinutes % 60;
            const hours = Math.floor(totalMinutes / 60);
            return `${hours}h ${minutes}m`;
        }
    }
}
</script>

<style scoped>
.cover-image {
    width: 100%;
    border-radius: 12px;
}

td.title {
    font-weight: bold;
    text-align: left;
}

td.detail {
    font-weight: normal;
    text-align: right;
}

td.title, td.detail {
    padding: 5px 10px;
}

.pl-0 {
    padding-left: 0 !important;
}

.genres {
    display: inline-block;
}
.genres::after {
    content: ',';
}

.genres:last-child::after {
    content: '';
}

h6.casts {
    font-weight: bold;
}
</style>