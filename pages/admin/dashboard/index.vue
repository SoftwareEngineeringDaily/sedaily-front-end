<template>
  <div class="admin-dashboard">
    <div v-if="me.isAdmin">
      <h1> Admin Dashboard </h1>

      <br>
      <br>
      <h2>
        Companies
      </h2>
      <br>
      <nuxt-link to="/admin/add-company">
        Create a company
      </nuxt-link>

      <div
        v-for="company in companies"
        :key="company._id">
        <div>
          Company Name: {{ company.companyName }}
          <nuxt-link
            :to="editCompany(company)">
            Edit </nuxt-link>
        </div>
        <div>
          externalUrl: {{ company.externalUrl }}
        </div>
        <div>
          localUrl: {{ company.localUrl }}

          <nuxt-link
            :to="companyPath(company)"
            target="_blank"
          >View</nuxt-link>
        </div>
        <hr>
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
  middleware: 'auth',
  fetch ({ store }) {
    store.dispatch('companiesFetch')
  },
  computed: {
    ...mapState({
      companies (state) {
        return state.companies
      },
      me ({ auth }) {
        return auth ? auth.user : null
      }
    })
  },
  methods: {
    ...mapActions(['companiesFetch']),
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
