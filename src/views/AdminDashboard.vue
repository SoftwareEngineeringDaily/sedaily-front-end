<template>
  <div>
    <div v-if="me.isAdmin">
      <h1> Admin Dashboard </h1>

      <h2>
        Companeis
      </h2>
      <div v-for="company in companies">
        {{company.localUrl}}
      </div>
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
    console.log('before mount..')
    this.fetchMyProfileData().then(() => {
      this.companiesFetch()
    })
  },

  computed: {
    ...mapState({
      companies (state) {
        return state.companies
      },
      me (state) {
        return state.me
      }
    })
  },
  methods: {
    ...mapActions(['companiesFetch', 'fetchMyProfileData'])
  }
}

</script>
