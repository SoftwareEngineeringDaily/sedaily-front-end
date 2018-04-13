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
import CompanyForm from '@/components/CompanyForm.vue'
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
  created () {
    if (!this.isLoggedIn) this.error = 'Unauthorized'
  },
  beforeMount () {
    // Should probably be fetching by id:
    // actions companiesFetchById
    this.companiesFetchById(this.$route.params.id)
      .then((company) => {
        console.log('company fetched', company)
        this.companyData = company
      })
      .catch(() => {
        this.$toasted.error('Error fecthing company')
      })
  },
  components: {
    CompanyForm
  },
  computed: {
    ...mapGetters([
      'isLoggedIn'
    ])
  },
  methods: {
    ...mapActions([
      'companiesEdit',
      'companiesFetchById',
      'deleteCompany'
    ]),

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
  }
}
</script>
