<template>
  <div>
    <br>
    <br>
    <h2> Edit Your Profile:</h2>
    <update-profile
      v-if="username"
      :initial-username="username"
      :me="me" />
  </div>
</template>

<script>
import UpdateProfile from '~/components/UpdateProfile.vue'
import { mapActions, mapState } from 'vuex'

export default {
  components: { UpdateProfile },
  computed: {
    ...mapState({
      me (state) {
        return state.auth ? state.auth.user : null
      },
      username () {
        return this.me && this.me.username
      }
    })
  }
}
</script>
