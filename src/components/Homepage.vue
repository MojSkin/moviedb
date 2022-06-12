<template>
    <div class="container">
        <div class="row rounded d-flex flex-row px-5 py-4 mb-5 justify-content-between align-items-center" style="border: solid 1px #CFCFCF; background: #E2E2E2; border-radius: 6px;">
            <div class="col-3 text-end">
                Search by release date:
            </div>
            <div class="col-3">
                <Datepicker
                    range
                    v-model="date"
                    lang="en"
                    show-clear-button
                    @reset="date=[]; getMovieList(1)"
                />
            </div>
            <div class="col-1 ml-auto">
                <button class="btn btn-primary rounded-pill ml-auto" @click="getMovieList(1)">Search</button>
            </div>
        </div>
        <div class="row d-flex justify-content-between flex-row py-5 position-relative">
            <div class="loading" v-if="loading">
                <span class="display-3 text-primary">Loading...</span>
            </div>
            <div class="movie-card" v-for="movie in all_movies" @click="pushRouter(movie)">
                <div class="row">
                    <div class="col-5 p-0 movie-cover">
                        <img :src="'https://image.tmdb.org/t/p/w500'+movie.poster_path" alt="">
                    </div>
                    <div class="col-7">
                        <div class="row d-flex flex-column h-100">
                            <div class="col-12">
                                <p class="movie-title">{{ movie.original_title }}</p>
                            </div>
                            <div class="col-12 mt-auto d-flex justify-content-start align-items-start">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <rect width="16" height="16" fill="url(#pattern0)"/>
                                    <defs>
                                        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                            <use xlink:href="#image0_8_18" transform="translate(0 -0.015625) scale(0.03125)"/>
                                        </pattern>
                                        <image id="image0_8_18" width="32" height="33" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAQAAAASL2HaAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiAwoOOCiX8bOWAAAA8ElEQVRIx+2VTw7BUBCHv9afBVsShxHHEAcQcQaLLiyqV+AGIjiDOAzClkVbxkbrTUkpEpv+ZtHk9958b+a9ZAr/lvXgtGkBa6YJv0MTWDFLBzrILYbKH8a+kw7YIHi4CAfl7xFcPIRtOiBEKABnxGjPQjgDBYRQJxRv3yp96oBtrI2eHmHjAVsmnEx7Efd4r0BHVEEUC809ZgYcdQslA1YnfPK8FrV4t5ERbfQV4h0FlElc2kcyixpweTPLxk1aPqJgr44V/Ij1pXJADsgBPwIU4/lSopthHkCgreXDEH0Vcz0TK/RoZKh8x1j/F/6nK0D2d+Xdbd9cAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTAzLTEwVDE0OjU2OjQwKzAwOjAwQn9tOgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wMy0xMFQxNDo1Njo0MCswMDowMDMi1YYAAAAASUVORK5CYII="/>
                                    </defs>
                                </svg>
                                <span>&nbsp;&nbsp;</span>
                                <div class="ml-2 text-secondary">{{ movie.release_date }}</div>
                            </div>
                            <div class="col-12">
                                <ul class="genre-list pl-0">
                                    <li class="movie-genre" v-for="g_id in movie.genre_ids">{{ getMovieGenre(g_id) }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-12 d-flex justify-content-center flex-row ">
                <button class="btn btn-link" :disabled="page<=1 || loading" @click="page = page>1 ? page-1 : 1">Previous Page</button>
                <span> | </span>
                <button class="btn btn-link" :disabled="loading" @click="page++">Next Page</button>
            </div>
            <div class="col-12 d-flex justify-content-center flex-row ">
                Showing results {{ ((page - 1) * 20 + 1) }} - {{ ((page) * 20) }}
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import slugify from 'slugify'
import * as moment from 'moment'
export default {
    name: "Homepage",
    data() {
        return {
            genres: [],
            all_movies: [],
            page: 1,
            date: [],
            loading: false,
        }
    },
    created() {
        axios({
            method: 'get',
            url: this.$store.state.movieGenresUrl+'?api_key='+this.$store.state.apiKey+'&language=en-US',
            headers: { }
        }).then(res => {
            this.genres = res?.data?.genres || []
        }).catch(err => {
            console.error('Error loading movie genres:', err?.response?.status || 'Unknown error code', err?.response?.statusText || 'Unknown error message')
        })
        this.getMovieList(1)
    },
    mounted() {
    },
    watch: {
        page() {
            this.getMovieList(this.page)
        },
    },
    methods: {
        getMovieGenre(genre_id) {
            for (let i = 0; i < this.genres.length; i++) {
                if (this.genres[i]?.id == genre_id) {
                    return this.genres[i]?.name || 'Genre '+genre_id+' has no name!'
                }
            }
            return 'Genre '+genre_id+' not found'
        },

        getMovieList(page_no) {
            this.page = page_no
            const rd_start = this.date.length === 2 ? moment(this.date[0]).format('YYYY-MM-DD').trim() : null
            const rd_end   = this.date.length === 2 ? moment(this.date[1]).format('YYYY-MM-DD').trim() : null
            const dateParams = this.date.length === 2 ? '&release_date.gte='+rd_start+'&release_date.lte='+rd_end : ''
            console.log(dateParams)
            this.loading = true
            axios({
                method: 'get',
                url: this.$store.state.movieListUrl+'?api_key='+this.$store.state.apiKey+'&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page='+page_no+'&with_watch_monetization_types=flatrate'+dateParams,
                headers: { }
            }).then(res => {
                this.all_movies = res?.data?.results || []
            }).catch(err => {
                console.error('Error loading movie list:', err?.response?.status || 'Unknown error code', err?.response?.statusText || 'Unknown error message')
            }).then(res => {
                this.loading = false
            })
        },

        pushRouter(movieDetail) {
            this.$store.state.movieDetail = movieDetail
            const slug = slugify(movieDetail?.original_title || "404", {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            })
            this.$router.push({ name: 'movie', params: { id: movieDetail?.id || 0, slug: slug }})
        }
    }
}
</script>

<style scoped>
.loading {
    position: absolute;
    inset: 0;
    z-index: 999;
    background-color: var(--bs-body-bg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.movie-card {
    font-size: 12px;
    font-weight: bold;
    font-family: "Roboto", Calibri, Tahoma, serif;
    margin-top: 10px;
    width: 295px;
    height: 195px;
    margin-bottom: 1rem;
    background: #F1F1F1;
    border-radius: 6px;
    border: 1px solid #C4C4C4;
    overflow: hidden;
    padding: 0;
    cursor: pointer;
}
.movie-card .row {
    margin-left: 1px !important;
    padding: 1px !important;
    overflow: hidden;
}
.movie-cover img{
    width: 128px;
    border-radius: 6px 0 0 6px;
    margin-left: unset;
    height: 190px;
    object-fit: cover;
}

.movie-title {
    font-weight: bold;
    margin-top: 10px;
}

ul.genre-list {
    padding-left: 0 !important;
    margin-top: 5px;
    margin-bottom: 0;
}

ul.genre-list li {
    width: auto;
    display: inline-block;
    margin-right: 17px;
    list-style-type: circle;
    font-weight: normal;
    color: #505050;
}

ul.genre-list li::after {
    content: ' ';
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #505050;
    margin: 6px 0 0 5px;
    position: absolute;
}

ul.genre-list li:last-child::after {
    content: unset;
}

</style>