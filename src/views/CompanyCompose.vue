<template>
  <div>
    <div v-if="isLoggedIn">
      <company-form
        :header="'Post a New Company:'"
        :submitCallback="submitCreateCompany"
        :loading="loading">
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
      error: null
    }
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
