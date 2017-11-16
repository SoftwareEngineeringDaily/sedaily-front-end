
<template>
  <div>
    <br />
    <br />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'feed-view',
  data () {
    return {
      loading: true
    }
  },
  beforeMount () {
    this.fetchMyProfileData()
    .then(() => {
      this.loading = false
      // this.fetchMyFeed
      // this.username = this.me.username
    })
  },
  methods: {
    ...mapActions([ 'fetchMyProfileData' ])
  },

  computed: {
    ...mapState({
      me (state) {
        return state.me
      }
    })
  }
}
</script>

<style scoped>
</style>
