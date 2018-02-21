<template>
  <div>
    <div v-if="isLoggedIn">
      <company-form
        :header="'Edit Company:'"
        :companyData='companyData'
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
      companyData: {},
      error: null
    }
  },
  beforeMount () {
    // Should probably be fetching by id:
    // actions companiesFetchById
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
    ...mapActions(['companiesCreate']),
    submitCreateCompany (company) {
      this.loading = true
      this.companiesCreate(company)
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
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>
