<template>

</template>

<script>
export default {
    name: "MovieCard",
    props: ['title', 'cover', 'release_date', 'genres'],
    data() {
        return {
            routes: {
                dashboard: LaravelRoute('doctor.dashboard'),
                getDoctorSchedule: LaravelRoute('api.getDoctorSchedule'),
            },
            permission: {
                add: this.permissions.ucaDoctorSchedule,
            },
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {}
}
</script>

<style scoped>

</style>