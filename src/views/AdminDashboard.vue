<template>
  <div class="admin-dashboard">
    <div v-if="me.isAdmin">
      <h1> Admin Dashboard </h1>

      <br />
      <br />
      <h2>
        Companeis
      </h2>
      <br />
      <router-link  to="/admin/add-company">
        Create a company
      </router-link>

      <div v-for="company in companies">

        <div>
          Company Name: {{company.companyName}}
          <router-link
          :to='editCompany(company)'>
          Edit </router-link>
        </div>
        <div>
          externalUrl: {{company.externalUrl}}
        </div>
        <div>
          localUrl: {{company.localUrl}}

          <router-link
          target="_blank"
          :to='companyPath(company)'
          >View</router-link>
        </div>
        <hr />
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
    ...mapActions(['companiesFetch', 'fetchMyProfileData']),
    editCompany (company) {
      return `/admin/edit-company/${company._id}`
    },
    companyPath (company) {
      return '/' + company.localUrl
    }
  }
}

</script>

<style scoped lang="stylus">
  .admin-dashboard
    padding 10px 20px
</style>
