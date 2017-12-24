<template>
<v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
  <div class='profile-details'>
    <br>
    <router-link to="/edit-profile">Edit Profile</router-link>
    <br>
    {{me.name}}
    <br>
    {{me.bio}}
    <br>    
  </div>
</v-flex>
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
