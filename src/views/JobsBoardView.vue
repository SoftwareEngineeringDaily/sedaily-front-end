
<template>
  <div>
    <h1> Jobs Board </h1>
    <div class="jobs-board">
      <router-link v-if="isLoggedIn" to="/add-job">
        Post a Job
      </router-link>
     <router-link v-else to="/login">
        Login to Post a Job
     </router-link>
      <!--<div>Log-in to post a job opening</div>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'jobs-board-view',

  components: {
  },

  data () {
    return {
      loading: true
    }
  },
  // beforeMount () {
  //   // You probably only need finally instead of both then and catch
  //   this.fetchMyProfileData()
  //     .then(() => {
  //       return this.fetchMyFeed({ userId: this.me._id })
  //         .then((feedItems) => {
  //           this.loading = false
  //         })
  //     })
  //     .catch((error) => {
  //       console.log('error logging in', error)
  //       this.fetchMyFeed({ userId: null })
  //         .then((feedItems) => {
  //           this.loading = false
  //         })
  //     })
  // },
  methods: {
    // ...mapActions(['fetchMyProfileData', 'fetchMyFeed'])
  },

  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>


<style scoped lang="stylus">
h1
  text-align center
  margin 30px auto
</style>
