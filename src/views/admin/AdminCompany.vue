<template>
  <div class="admin-company">
    <h2> Companies </h2>
    <div class="button-group">
      <router-link class="button-submit" to="/admin/company/add">Create new company</router-link>
    </div>
    <div v-for="company in companies" :key="company._id" class="company-block">
      <div class="name">{{company.companyName}}</div>
      <div>externalUrl: {{company.externalUrl}}</div>
      <div>localUrl: {{company.localUrl}}</div>
      <div class="button-group">
        <router-link class="link-button" target="_blank" :to='companyPath(company)'>View</router-link>
        <router-link class="link-button" :to='editCompany(company)'>Edit</router-link>
      </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'admin-company',
  beforeMount () {
    this.companiesFetch()
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
    ...mapActions(['companiesFetch']),
    editCompany (company) {
      return `/admin/company/${company._id}`
    },
    companyPath (company) {
      return '/' + company.localUrl
    }
  }
}
</script>

<style scoped lang="stylus">
  .company-block
    margin 10px 0
    padding 10px 0
    border-bottom 1px solid #cecece
    line-height 2

    .name
      font-size 18px
      font-weight 600
</style>
