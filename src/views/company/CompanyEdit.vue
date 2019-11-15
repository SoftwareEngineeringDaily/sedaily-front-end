<template>
  <div>
    <div v-if="isLoggedIn">
      <company-form
        :header="'Edit Company:'"
        :companyData='companyData'
        :deleteCallback='deleteCoompanyCallback'
        :submitCallback="submitCreateCompany"
        >
      </company-form>
    </div>

    <div v-if="error">
      <div class="bg-danger"> Error: {{ error }}</div>
    </div>
  </div>
</template>

<script>
import CompanyForm from '@/components/company/CompanyForm'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'company-compose',
  data () {
    return {
      loading: false,
      companyData: null,
      error: null
    }
  },
  beforeMount () {
    // Should probably be fetching by id:
    // actions companiesFetchById
    this.companiesFetchById(this.$route.params.id)
      .then((company) => {
        this.companyData = company
      })
      .catch(() => {
        this.$toasted.error('Error fecthing company')
      })
  },
  created () {
    if (!this.isLoggedIn) {
      this.error = 'Unauthorized'
    }
  },
  components: {
    CompanyForm
  },
  methods: {
    ...mapActions(['companiesEdit', 'companiesFetchById', 'deleteCompany']),
    deleteCoompanyCallback () {
      this.deleteCompany(this.companyData._id)
        .then(() => {
          this.$toasted.show('Company was deleted.')
          this.$router.push('/admin')
        })
        .catch(() => {
          this.$toasted.error('Error deleting company---------------')
        })
    },
    submitCreateCompany (company) {
      this.loading = true
      this.companiesEdit(company)
        .then(() => {
          this.$toasted.show('Successfully Posted!')
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
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>
