<template>
  <div>

    <div v-if="me.isAdmin">
      <h1> Admin Dashboard </h1>
    </div>
    <div v-else>
      You don't have access to the admin dashboard.
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'admin-dashboard',
  beforeMount () {
    this.fetchMyProfileData()
  },

  computed: {
    ...mapState({
      me (state) {
        return state.me
      }
    })
  },
  methods: {
    ...mapActions(['fetchMyProfileData'])
  }
}

</script>
