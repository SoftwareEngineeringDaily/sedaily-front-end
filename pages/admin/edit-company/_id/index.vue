<template>
  <div>
    <div v-if="isLoggedIn">
      <company-form
        :header="'Edit Company:'"
        :company-data="companyData"
        :delete-callback="deleteCompanyCallback"
        :submit-callback="submitCreateCompany" />
    </div>

    <div v-if="error">
      <div class="bg-danger"> Error: {{ error }}</div>
    </div>
  </div>
</template>

<script>
import CompanyForm from '~/components/CompanyForm.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    CompanyForm
  },
  data () {
    return {
      loading: false,
      companyData: null,
      error: null
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  fetch ({ store, params }) {
    // Should probably be fetching by id:
    // actions companiesFetchById
    store
      .dispatch('companiedFetchById', params.id)
      .then((company) => {
        this.companyData = company
      })
      .catch(() => {
        alert('Error fetching company')
      })
  },
  created () {
    if (!this.isLoggedIn) {
      this.error = 'Unauthorized'
    }
  },
  methods: {
    ...mapActions(['companiesEdit', 'companiesFetchById', 'deleteCompany']),
    deleteCompanyCallback () {
      this.deleteCompany(this.companyData._id)
        .then(() => {
          alert('Company was deleted.')
          this.$router.push('/admin')
        })
        .catch(() => {
          alert('Error deleting company---------------')
        })
    },
    submitCreateCompany (company) {
      this.loading = true
      this.companiesEdit(company)
        .then(() => {
          alert('Successfully Posted!')
          this.loading = false
          this.$router.push('/admin')
        })
        .catch((error) => {
          this.loading = false
          this.error = error.response.data.message
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
