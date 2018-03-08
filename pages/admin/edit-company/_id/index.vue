<template>
  <div>
    <div v-if="isLoggedIn && companyData">
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
      .dispatch('companiesFetchById', params.id)
      .then((company) => {
        this.companyData = company
      })
      .catch(() => {
        this.$toast.error('Error fetching company')
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
          this.$toast.show('Company was deleted.')
          this.$router.push('/admin')
        })
        .catch(() => {
          this.$toast.error('Error deleting company---------------')
        })
    },
    submitCreateCompany (company) {
      this.loading = true
      this.companiesEdit(company)
        .then(() => {
          this.$toast.show('Successfully Posted!')
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
