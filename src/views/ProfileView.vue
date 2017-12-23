<template>
  <div class='profile-details'>
    <br>
    <router-link to="/edit-profile">Edit Profile</router-link>
    <br>
    {{me.name}}
    <br>
    {{me.bio}}
    <br>    
  </div>

</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'profile-view',
  beforeMount () {
    this.fetchMyProfileData()
      .then(() => {
        this.loading = false
        this.username = this.me.username
      })
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
