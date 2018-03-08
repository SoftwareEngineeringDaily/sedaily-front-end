<template>
  <div>
    <div v-if="isLoggedIn">
      <company-form
        :header="'Post a New Company:'"
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
      error: null
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  created () {
    if (!this.isLoggedIn) {
      this.error = 'Unauthorized'
    }
  },
  methods: {
    ...mapActions(['companiesCreate']),
    submitCreateCompany (company) {
      this.loading = true
      this.companiesCreate(company)
        .then(() => {
          this.$toast.message('Successfully Posted!')
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
