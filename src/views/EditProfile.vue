<template>
  <div>
    <br />
    <br />
    <h2> Edit Your Profile:</h2>
    <update-profile  v-if="username" :initialUsername="username" :me="me"> </update-profile>
  </div>
</template>

<script>
import UpdateProfile from '@/components/UpdateProfile.vue'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'edit-profile',
  components: {UpdateProfile},
  data () {
    return {
      loading: true,
      username: null
    }
  },
  beforeMount () {
    this.fetchMyProfileData()
    .then(() => {
      this.loading = false
      this.username = this.me.username
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
